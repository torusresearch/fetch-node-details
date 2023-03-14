import { AbiType, StateMutabilityType } from "web3-utils";

export interface INodePub {
  X: string;
  Y: string;
}

export interface INodeDetails {
  currentEpoch: string;
  nodeListAddress: string;
  torusNodeEndpoints: string[];
  torusNodePub: INodePub[];
  torusIndexes: number[];
  updated: boolean;
}

export const TORUS_NETWORK = {
  TESTNET: "testnet",
  MAINNET: "mainnet",
  CYAN: "cyan",
  AQUA: "aqua",
  CELESTE: "celeste",
} as const;

export const NETWORK_MAP = {
  [TORUS_NETWORK.MAINNET]: "mainnet",
  [TORUS_NETWORK.TESTNET]: "goerli",
  [TORUS_NETWORK.CYAN]: "polygon-mainnet",
  [TORUS_NETWORK.AQUA]: "polygon-mainnet",
  [TORUS_NETWORK.CELESTE]: "polygon-mainnet",
};

export type TORUS_NETWORK_TYPE = (typeof TORUS_NETWORK)[keyof typeof TORUS_NETWORK];

export type NodeDetailManagerParams = { network?: TORUS_NETWORK_TYPE | string; proxyAddress?: string };

export const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_verifier",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "hashedVerifierId",
        type: "bytes32",
      },
    ],
    name: "getNodeSet",
    outputs: [
      {
        internalType: "uint256",
        name: "currentEpoch",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "torusNodeEndpoints",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "torusNodePubX",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "torusNodePubY",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "torusIndexes",
        type: "uint256[]",
      },
    ],
    stateMutability: "view" as StateMutabilityType,
    type: "function" as AbiType,
  },
];
