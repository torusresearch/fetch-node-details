import { TORUS_NETWORK, TORUS_SAPPHIRE_NETWORK } from "./constants";

export interface JRPCResponse<T> {
  id: number;
  jsonrpc: "2.0";
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface INodePub {
  X: string;
  Y: string;
}

export interface INodeDetails {
  currentEpoch: string;
  torusNodeEndpoints: string[];
  torusNodeSSSEndpoints?: string[];
  torusNodeRSSEndpoints?: string[];
  torusNodeTSSEndpoints?: string[];
  torusNodePub: INodePub[];
  torusIndexes: number[];
  updated?: boolean;
}

export type TORUS_SAPPHIRE_NETWORK_TYPE = (typeof TORUS_SAPPHIRE_NETWORK)[keyof typeof TORUS_SAPPHIRE_NETWORK];

export type TORUS_NETWORK_TYPE = (typeof TORUS_NETWORK)[keyof typeof TORUS_NETWORK];

export type NODE = {
  address: string;
  node_index: string;
  epoch: string;
  public_key: {
    X: string;
    Y: string;
  };
};

export interface NodeLookupResponse {
  nodes: NODE[];
}
