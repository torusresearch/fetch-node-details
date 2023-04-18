import { URL } from "node:url";

import { abi, INodeDetails, INodePub, NETWORK_MAP, TORUS_NETWORK } from "@toruslabs/constants";
import { NODE_DETAILS_MAINNET, NODE_DETAILS_TESTNET } from "@toruslabs/fnd-base";
import JsonStringify from "json-stable-stringify";
import Web3EthContract from "web3-eth-contract";
import { keccak256, toHex } from "web3-utils";

import { INFURA_PROJECT_ID } from "./constants";

export const thresholdSame = <T>(arr: T[], t: number): T | undefined => {
  const hashMap: Record<string, number> = {};
  for (let i = 0; i < arr.length; i += 1) {
    const str = JsonStringify(arr[i]);
    hashMap[str] = hashMap[str] ? hashMap[str] + 1 : 1;
    if (hashMap[str] === t) {
      return arr[i];
    }
  }
  return undefined;
};

export const getLegacyNodeDetails = async ({
  verifier,
  verifierId,
  network,
  proxyAddress,
}: {
  verifier: string;
  verifierId: string;
  network: string;
  proxyAddress: string;
}): Promise<INodeDetails> => {
  try {
    let url: string;
    try {
      const localUrl = new URL(network);
      url = localUrl.href;
    } catch (_) {
      url = `https://${(NETWORK_MAP as Record<string, string>)[network]}.infura.io/v3/${INFURA_PROJECT_ID}`;
    }

    Web3EthContract.setProvider(url);
    const nodeListContract = new Web3EthContract(abi, proxyAddress);
    const hashedVerifierId = keccak256(verifierId);
    const nodeDetails = await nodeListContract.methods.getNodeSet(verifier, hashedVerifierId).call();
    const { currentEpoch, torusNodeEndpoints, torusNodePubX, torusNodePubY, torusIndexes } = nodeDetails;
    const _torusIndexes = torusIndexes.map((x: string) => Number(x));
    const updatedEndpoints: string[] = [];
    const updatedNodePub: INodePub[] = [];
    for (let index = 0; index < torusNodeEndpoints.length; index += 1) {
      const endPointElement = torusNodeEndpoints[index];
      const pubKx = torusNodePubX[index];
      const pubKy = torusNodePubY[index];
      const endpoint = `https://${endPointElement.split(":")[0]}/jrpc`;
      updatedEndpoints.push(endpoint);
      updatedNodePub.push({ X: toHex(pubKx).replace("0x", ""), Y: toHex(pubKy).replace("0x", "") });
    }
    return {
      currentEpoch,
      torusIndexes: _torusIndexes,
      torusNodeEndpoints: updatedEndpoints,
      torusNodePub: updatedNodePub,
    };
  } catch (error) {
    if (network === TORUS_NETWORK.MAINNET) {
      return NODE_DETAILS_MAINNET;
    } else if (network === TORUS_NETWORK.TESTNET) {
      return NODE_DETAILS_TESTNET;
    }
    throw error;
  }
};
