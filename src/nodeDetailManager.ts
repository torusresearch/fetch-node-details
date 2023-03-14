import { generateJsonRPCObject, post } from "@toruslabs/http-helpers";
import log from "loglevel";

import { NETWORK_URLS } from "./constants";
import { INodeDetails, INodePub, JRPCResponse, NodeDetailManagerParams, NodeLookupResponse, TORUS_NETWORK, TORUS_NETWORK_TYPE } from "./interfaces";
import { thresholdSame } from "./utils";

class NodeDetailManager {
  public static NODE_DETAILS_DEVNET: INodeDetails = {
    torusNodeBaseEndpoints: [
      "https://sapphire-dev-2-1.authnetwork.dev",
      "https://sapphire-dev-2-2.authnetwork.dev",
      "https://sapphire-dev-2-3.authnetwork.dev",
      "https://sapphire-dev-2-4.authnetwork.dev",
      "https://sapphire-dev-2-5.authnetwork.dev",
    ],

    torusNodeSSSEndpoints: [
      "https://sapphire-dev-2-1.authnetwork.dev/sss/jrpc",
      "https://sapphire-dev-2-2.authnetwork.dev/sss/jrpc",
      "https://sapphire-dev-2-3.authnetwork.dev/sss/jrpc",
      "https://sapphire-dev-2-4.authnetwork.dev/sss/jrpc",
      "https://sapphire-dev-2-5.authnetwork.dev/sss/jrpc",
    ],

    torusNodeRSSEndpoints: [
      "https://sapphire-dev-2-1.authnetwork.dev/rss",
      "https://sapphire-dev-2-2.authnetwork.dev/rss",
      "https://sapphire-dev-2-3.authnetwork.dev/rss",
      "https://sapphire-dev-2-4.authnetwork.dev/rss",
      "https://sapphire-dev-2-5.authnetwork.dev/rss",
    ],

    torusNodeTSSEndpoints: [
      "https://sapphire-dev-2-1.authnetwork.dev/tss",
      "https://sapphire-dev-2-2.authnetwork.dev/tss",
      "https://sapphire-dev-2-3.authnetwork.dev/tss",
      "https://sapphire-dev-2-4.authnetwork.dev/tss",
      "https://sapphire-dev-2-5.authnetwork.dev/tss",
    ],
    torusIndexes: [1, 2, 3, 4, 5],
    torusNodePub: [
      {
        X: "f74389b0a4c8d10d2a687ae575f69b20f412d41ab7f1fe6b358aa14871327247",
        Y: "54e3a73098ed9bced3ef8821736e9794f9264a1420c0c7ad15d2fa617ba35ef7",
      },
      {
        X: "bc38813a6873e526087918507c78fc3a61624670ee851ecfb4f3bef55d027b5a",
        Y: "ac4b21229f662a0aefdfdac21cf17c3261a392c74a8790db218b34e3e4c1d56a",
      },
      {
        X: "b56541684ea5fa40c8337b7688d502f0e9e092098962ad344c34e94f06d293fb",
        Y: "759a998cef79d389082f9a75061a29190eec0cac99b8c25ddcf6b58569dad55c",
      },
      {
        X: "7bcb058d4c6ffc6ba4bfdfd93d141af35a66338a62c7c27cdad2ae3f8289b767",
        Y: "336ab1935e41ed4719e162587f0ab55518db4207a1eb36cc72303f1b86689d2b",
      },
      {
        X: "bf12a136ef94399ea098f926f04e26a4ec4ac70f69cce274e8893704c4951773",
        Y: "bdd44828020f52ce510e026338216ada184a6867eb4e19fb4c2d495d4a7e15e4",
      },
    ],
    updated: false,
  };

  private _torusNodeBaseEndpoints: string[] = [];

  private _torusNodeRSSEndpoints: string[] = [];

  private _torusNodeSSSEndpoints: string[] = [];

  private _torusNodeTSSEndpoints: string[] = [];

  private _torusNodePub: INodePub[] = [];

  private _torusIndexes: number[] = [];

  private updated: boolean;

  private network: TORUS_NETWORK_TYPE;

  private customEndpoints: string[];

  constructor({ network = TORUS_NETWORK.DEVNET, customEndpoints }: NodeDetailManagerParams = {}) {
    this.network = network;
    this.customEndpoints = customEndpoints || [];
    this.updated = false;
  }

  get _nodeDetails(): INodeDetails {
    return {
      torusNodeBaseEndpoints: this._torusNodeBaseEndpoints,
      torusNodeSSSEndpoints: this._torusNodeSSSEndpoints,
      torusNodeRSSEndpoints: this._torusNodeRSSEndpoints,
      torusNodeTSSEndpoints: this._torusNodeTSSEndpoints,
      torusNodePub: this._torusNodePub,
      torusIndexes: this._torusIndexes,
      updated: this.updated,
    };
  }

  async getNodeDetails(): Promise<INodeDetails> {
    try {
      if (this.updated) return this._nodeDetails;
      let endPoints = NETWORK_URLS[this.network] as string[];
      if (this.customEndpoints.length > 0) {
        endPoints = this.customEndpoints;
      }
      if (!endPoints || endPoints.length === 0) {
        throw new Error(`Node Endpoints not found for ${this.network} network, Please pass custom endpoints in constructor`);
      }

      const lookupPromises = endPoints.map((x) =>
        post<JRPCResponse<NodeLookupResponse>>(`${x}/sss/jrpc`, generateJsonRPCObject("NodeDetailsRequest", {})).catch((err) =>
          log.error("node lookup request failed", err)
        )
      );

      const lookupResponses = await Promise.all(lookupPromises);

      const errorResult = thresholdSame(
        lookupResponses.map((x2) => x2 && x2.error),
        ~~(endPoints.length / 2) + 1
      );
      const threholdNodes = thresholdSame(
        lookupResponses.map((x3) => x3 && x3.result),
        ~~(endPoints.length / 2) + 1
      );

      if (!threholdNodes && !errorResult) {
        throw new Error(`invalid results ${JSON.stringify(lookupResponses)}`);
      }

      if (errorResult) {
        throw new Error(`node lookup results do not match, ${JSON.stringify(errorResult || {})}`);
      }

      if (!threholdNodes) {
        throw new Error("Unable to reach threshold for node lookups");
      }

      const parsedNodes = threholdNodes.nodes;

      if (parsedNodes.length !== endPoints.length) {
        throw new Error(`Unable to fetch info for required nodes, required: ${endPoints.length}, found: ${parsedNodes.length}`);
      }
      const updatedBaseEndpoints: string[] = [];
      const updatedSSSEndpoints: string[] = [];
      const updatedRSSEndpoints: string[] = [];
      const updatedTSSEndpoints: string[] = [];
      const updatedNodePub: INodePub[] = [];
      const indexes: number[] = [];

      // nodes returns node list in sorted order of node indexes
      // currently node indexes are sorted in the order of endpoints.
      // so looping over endpoints is fine.
      for (let index = 0; index < endPoints.length; index++) {
        const endpoint = endPoints[index];
        const nodeInfo = parsedNodes[index];
        const pubKx = nodeInfo.public_key.X;
        const pubKy = nodeInfo.public_key.Y;
        indexes.push(parseInt(nodeInfo.node_index, 10));
        updatedBaseEndpoints.push(endpoint);
        updatedSSSEndpoints.push(`${endpoint}/sss/jrpc`);
        updatedRSSEndpoints.push(`${endpoint}/rss`);
        updatedTSSEndpoints.push(`${endpoint}/tss`);
        updatedNodePub.push({ X: pubKx, Y: pubKy });
      }
      this._torusNodeBaseEndpoints = updatedBaseEndpoints;
      this._torusNodeSSSEndpoints = updatedSSSEndpoints;
      this._torusNodeRSSEndpoints = updatedRSSEndpoints;
      this._torusNodeTSSEndpoints = updatedTSSEndpoints;
      this._torusNodePub = updatedNodePub;
      this._torusIndexes = indexes;
      this.updated = true;
      return this._nodeDetails;
    } catch (error) {
      log.error("Failed to fetch node details", error);
      if (this.network === TORUS_NETWORK.DEVNET) {
        return NodeDetailManager.NODE_DETAILS_DEVNET;
      }
      throw error;
    }
  }
}

export default NodeDetailManager;
