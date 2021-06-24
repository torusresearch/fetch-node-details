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

export interface INodeEndpoint {
  declaredIp: string;
  pubKx: string;
  pubKy: string;
}

export const abi = [
  {
    constant: true,
    inputs: [],
    name: "currentEpoch",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view" as StateMutabilityType,
    type: "function" as AbiType,
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
    ],
    name: "getEpochInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "n",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "k",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "t",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "nodeList",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "prevEpoch",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nextEpoch",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view" as StateMutabilityType,
    type: "function" as AbiType,
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "nodeAddress",
        type: "address",
      },
    ],
    name: "getNodeDetails",
    outputs: [
      {
        internalType: "string",
        name: "declaredIp",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "position",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pubKx",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pubKy",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tmP2PListenAddress",
        type: "string",
      },
      {
        internalType: "string",
        name: "p2pListenAddress",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view" as StateMutabilityType,
    type: "function" as AbiType,
  },
];
