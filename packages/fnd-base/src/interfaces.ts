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
  torusNodeBaseEndpoints: string[];
  torusNodeSSSEndpoints: string[];
  torusNodeRSSEndpoints: string[];
  torusNodeTSSEndpoints: string[];
  torusNodePub: INodePub[];
  torusIndexes: number[];
  updated?: boolean;
}

export const TORUS_NETWORK = {
  DEVNET: "devnet",
  TESTNET: "testnet",
} as const;

export type TORUS_NETWORK_TYPE = (typeof TORUS_NETWORK)[keyof typeof TORUS_NETWORK];

export type NodeDetails = {
  address: string;
  node_index: string;
  public_key: {
    X: string;
    Y: string;
  };
};

export interface NodeLookupResponse {
  nodes: NodeDetails[];
}
