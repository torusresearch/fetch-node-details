import Web3EthContract from "web3-eth-contract";
import { keccak256, toHex } from "web3-utils";

import { PROXY_CONTRACT_ADDRESS, TORUS_NETWORK } from "./constants";
import { abi, INodeDetails, INodePub } from "./interfaces";
import { NODE_DETAILS_MAINNET } from "./mainnetConfig";
import { NODE_DETAILS_TESTNET } from "./testnetConfig";
export const NETWORK_MAP = {
  [TORUS_NETWORK.MAINNET]: "mainnet",
  [TORUS_NETWORK.TESTNET]: "goerli",
  [TORUS_NETWORK.CYAN]: "polygon-mainnet",
  [TORUS_NETWORK.AQUA]: "polygon-mainnet",
  [TORUS_NETWORK.CELESTE]: "polygon-mainnet",
};

export const getLegacyNodeDetails = async ({
  verifier,
  verifierId,
  network,
}: {
  verifier: string;
  verifierId: string;
  network: string;
}): Promise<INodeDetails> => {
  try {
    const projectId = process.env.INFURA_PROJECT_ID;
    const url = `https://${(NETWORK_MAP as Record<string, string>)[network]}.infura.io/v3/${projectId}`;
    Web3EthContract.Contract.setProvider(url);
    const proxyAddress = (PROXY_CONTRACT_ADDRESS as Record<string, string>)[network];
    const nodeListContract = new Web3EthContract.Contract(abi, proxyAddress);
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
