import { URL } from "node:url";

import { abi, INodeDetails, INodePub, NETWORK_MAP } from "@toruslabs/constants";
import { Contract, JsonRpcProvider, keccak256, toBeHex } from "ethers";
import JsonStringify from "json-stable-stringify";
import log from "loglevel";

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
  let url: string;
  try {
    const localUrl = new URL(network);
    url = localUrl.href;
  } catch (_) {
    url = `https://${(NETWORK_MAP as Record<string, string>)[network]}.infura.io/v3/${INFURA_PROJECT_ID}`;
  }
  log.info("proxy using url", url, network, verifier, verifierId, proxyAddress);

  const provider = new JsonRpcProvider(url);
  const nodeListContract = new Contract(proxyAddress, abi, provider);
  const hashedVerifierId = keccak256(Buffer.from(verifierId, "utf8"));
  const nodeDetails: {
    currentEpoch: bigint;
    torusNodeEndpoints: string[];
    torusNodePubX: bigint[];
    torusNodePubY: bigint[];
    torusIndexes: bigint[];
  } = await nodeListContract.getNodeSet(verifier, hashedVerifierId);
  const { currentEpoch, torusNodeEndpoints, torusNodePubX, torusNodePubY, torusIndexes } = nodeDetails;
  const _torusIndexes = torusIndexes.map((x: bigint) => Number(x));
  const updatedEndpoints: string[] = [];
  const updatedNodePub: INodePub[] = [];
  for (let index = 0; index < torusNodeEndpoints.length; index += 1) {
    const endPointElement = torusNodeEndpoints[index];
    const pubKx = torusNodePubX[index];
    const pubKy = torusNodePubY[index];
    const endpoint = `https://${endPointElement.split(":")[0]}/jrpc`;
    updatedEndpoints.push(endpoint);
    updatedNodePub.push({ X: toBeHex(pubKx).replace("0x", ""), Y: toBeHex(pubKy).replace("0x", "") });
  }
  return {
    currentEpoch: currentEpoch.toString(),
    torusIndexes: _torusIndexes,
    torusNodeEndpoints: updatedEndpoints,
    torusNodePub: updatedNodePub,
    updated: true,
  };
};
