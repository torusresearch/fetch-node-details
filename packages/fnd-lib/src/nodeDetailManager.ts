import { INodeDetails, INodePub, NODE_DETAILS_DEVNET, NODE_DETAILS_TESTNET, TORUS_NETWORK, TORUS_NETWORK_TYPE } from "@toruslabs/fnd-base";
import { get } from "@toruslabs/http-helpers";
import log from "loglevel";

import { NodeDetailManagerParams } from "./interfaces";
class NodeDetailManager {
  private fndServerEndpoint = "https://fnd.tor.us/nodesDetails";

  private _torusNodeBaseEndpoints: string[] = [];

  private _torusNodeRSSEndpoints: string[] = [];

  private _torusNodeSSSEndpoints: string[] = [];

  private _torusNodeTSSEndpoints: string[] = [];

  private _torusNodePub: INodePub[] = [];

  private _torusIndexes: number[] = [];

  private updated: boolean;

  private network: TORUS_NETWORK_TYPE;

  constructor({ network = TORUS_NETWORK.DEVNET, fndServerEndpoint }: NodeDetailManagerParams = {}) {
    this.network = network;
    this.updated = false;
    this.fndServerEndpoint = fndServerEndpoint;
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

  fetchLocalConfig(network: TORUS_NETWORK_TYPE): INodeDetails {
    if (network === TORUS_NETWORK.DEVNET) {
      return NODE_DETAILS_DEVNET;
    } else if (network === TORUS_NETWORK.TESTNET) {
      return NODE_DETAILS_TESTNET;
    }
    throw new Error(`Unsupported network: ${network}`);
  }

  async getNodeDetails({ skipServer = false }: { skipServer?: boolean }): Promise<INodeDetails> {
    try {
      if (this.updated) return this._nodeDetails;
      if (this.updated) {
        return this._nodeDetails;
      }

      if (!skipServer) {
        try {
          const { nodesDetails } = await get<{ nodesDetails: INodeDetails }>(`${this.fndServerEndpoint}?network=${this.network}`, {}, {});
          this.setNodeDetails(nodesDetails);
          return this._nodeDetails;
        } catch (error) {
          log.error("Failed to fetch node details from server, using local", error);
        }
      }
      const nodeDetails = this.fetchLocalConfig(this.network);
      this.setNodeDetails(nodeDetails);
      return this._nodeDetails;
    } catch (error) {
      log.error("Failed to fetch node details", error);
      throw error;
    }
  }

  private setNodeDetails(nodeDetails: INodeDetails) {
    const { torusNodeBaseEndpoints, torusNodeSSSEndpoints, torusNodeRSSEndpoints, torusNodeTSSEndpoints, torusNodePub, torusIndexes } = nodeDetails;
    this._torusNodeBaseEndpoints = torusNodeBaseEndpoints;
    this._torusNodeSSSEndpoints = torusNodeSSSEndpoints;
    this._torusNodeRSSEndpoints = torusNodeRSSEndpoints;
    this._torusNodeTSSEndpoints = torusNodeTSSEndpoints;
    this._torusNodePub = torusNodePub;
    this._torusIndexes = torusIndexes;
    this.updated = true;
  }
}

export default NodeDetailManager;
