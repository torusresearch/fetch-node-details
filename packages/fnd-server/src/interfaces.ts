import { AbiType, StateMutabilityType } from "web3-utils";

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
