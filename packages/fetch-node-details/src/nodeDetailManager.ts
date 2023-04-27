import { INodeDetails, INodePub, MULTI_CLUSTER_NETWORKS, TORUS_NETWORK, TORUS_NETWORK_TYPE } from "@toruslabs/constants";
import { fetchLocalConfig } from "@toruslabs/fnd-base";
import { get } from "@toruslabs/http-helpers";
import logger from "loglevel";

import { NodeDetailManagerParams } from "./interfaces";

const log = logger.getLogger("fnd");

class NodeDetailManager {
  private fndServerEndpoint = "https://fnd.tor.us/node-details";

  private _currentEpoch = "1";

  private _torusNodeEndpoints: string[] = [];

  private _torusNodeRSSEndpoints: string[] = [];

  private _torusNodeSSSEndpoints: string[] = [];

  private _torusNodeTSSEndpoints: string[] = [];

  private _torusNodePub: INodePub[] = [];

  private _torusIndexes: number[] = [];

  private updated: boolean;

  private network: TORUS_NETWORK_TYPE;

  constructor({ network = TORUS_NETWORK.MAINNET, fndServerEndpoint, enableLogging = false }: NodeDetailManagerParams = {}) {
    this.network = network;
    this.updated = false;
    if (fndServerEndpoint) {
      this.fndServerEndpoint = fndServerEndpoint;
    }
    if (enableLogging) {
      log.enableAll();
    } else {
      log.disableAll();
    }
  }

  get _nodeDetails(): INodeDetails {
    return {
      currentEpoch: this._currentEpoch,
      torusNodeEndpoints: this._torusNodeEndpoints,
      torusNodeSSSEndpoints: this._torusNodeSSSEndpoints,
      torusNodeRSSEndpoints: this._torusNodeRSSEndpoints,
      torusNodeTSSEndpoints: this._torusNodeTSSEndpoints,
      torusNodePub: this._torusNodePub,
      torusIndexes: this._torusIndexes,
      updated: this.updated,
    };
  }

  async getNodeDetails({ verifier, verifierId }: { verifier: string; verifierId: string }): Promise<INodeDetails> {
    try {
      if (this.updated && !MULTI_CLUSTER_NETWORKS.includes(this.network)) return this._nodeDetails;

      try {
        const { nodeDetails } = await get<{ nodeDetails: INodeDetails }>(
          `${this.fndServerEndpoint}?network=${this.network}&verifier=${verifier}&verifierId=${verifierId}`
        );
        this.setNodeDetails(nodeDetails);

        return this._nodeDetails;
      } catch (error) {
        log.error("Failed to fetch node details from server, using local.", error);
      }

      const nodeDetails = fetchLocalConfig(this.network as TORUS_NETWORK_TYPE);
      if (!nodeDetails) throw new Error("Failed to fetch node details");
      this.setNodeDetails(nodeDetails);
      return this._nodeDetails;
    } catch (error) {
      log.error("Failed to fetch node details", error);
      throw error;
    }
  }

  private setNodeDetails(nodeDetails: INodeDetails) {
    const { currentEpoch, torusNodeEndpoints, torusNodeSSSEndpoints, torusNodeRSSEndpoints, torusNodeTSSEndpoints, torusNodePub, torusIndexes } =
      nodeDetails;
    this._torusNodeEndpoints = torusNodeEndpoints;
    this._torusNodeSSSEndpoints = torusNodeSSSEndpoints || [];
    this._torusNodeRSSEndpoints = torusNodeRSSEndpoints || [];
    this._torusNodeTSSEndpoints = torusNodeTSSEndpoints || [];
    this._torusNodePub = torusNodePub;
    this._torusIndexes = torusIndexes;
    this._currentEpoch = currentEpoch;
    this.updated = true;
  }
}

export default NodeDetailManager;
