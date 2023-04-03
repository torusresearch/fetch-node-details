import {
  getLegacyNodeDetails,
  INodeDetails,
  INodePub,
  NODE_DETAILS_MAINNET,
  NODE_DETAILS_SAPPHIRE_DEVNET,
  NODE_DETAILS_SAPPHIRE_TESTNET,
  NODE_DETAILS_TESTNET,
  PROXY_CONTRACT_ADDRESS,
  TORUS_NETWORK,
  TORUS_NETWORK_TYPE,
} from "@toruslabs/fnd-base";
import { get } from "@toruslabs/http-helpers";
import log from "loglevel";

import { NodeDetailManagerParams } from "./interfaces";

class NodeDetailManager {
  private fndServerEndpoint = "https://fnd.tor.us/nodesDetails";

  private _currentEpoch = "1";

  private _proxyContractAddress = PROXY_CONTRACT_ADDRESS[TORUS_NETWORK.MAINNET];

  private _torusNodeEndpoints: string[] = [];

  private _torusNodeRSSEndpoints: string[] = [];

  private _torusNodeSSSEndpoints: string[] = [];

  private _torusNodeTSSEndpoints: string[] = [];

  private _torusNodePub: INodePub[] = [];

  private _torusIndexes: number[] = [];

  private updated: boolean;

  private network: TORUS_NETWORK_TYPE;

  constructor({
    network = TORUS_NETWORK.MAINNET,
    proxyAddress = PROXY_CONTRACT_ADDRESS[TORUS_NETWORK.MAINNET],
    fndServerEndpoint,
  }: NodeDetailManagerParams = {}) {
    this.network = network;
    this._proxyContractAddress = proxyAddress;
    this.updated = false;
    if (fndServerEndpoint) {
      this.fndServerEndpoint = fndServerEndpoint;
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

  fetchLocalConfig(network: TORUS_NETWORK_TYPE): INodeDetails | undefined {
    if (network === TORUS_NETWORK.SAPPHIRE_DEVNET) {
      return NODE_DETAILS_SAPPHIRE_DEVNET;
    } else if (network === TORUS_NETWORK.SAPPHIRE_TESTNET) {
      return NODE_DETAILS_SAPPHIRE_TESTNET;
    } else if (network === TORUS_NETWORK.MAINNET) {
      return NODE_DETAILS_MAINNET;
    } else if (network === TORUS_NETWORK.TESTNET) {
      return NODE_DETAILS_TESTNET;
    }
    return undefined;
  }

  async getNodeDetails({
    skipServer = false,
    verifier,
    verifierId,
  }: {
    skipServer?: boolean;
    verifier?: string;
    verifierId?: string;
  }): Promise<INodeDetails> {
    try {
      if (this.updated) return this._nodeDetails;
      if (this.updated) {
        return this._nodeDetails;
      }

      if (!skipServer) {
        try {
          const { nodesDetails } = await get<{ nodesDetails: INodeDetails }>(
            `${this.fndServerEndpoint}?network=${this.network}&verifier=${verifier}&verifierId=${verifierId}`,
            {},
            {}
          );
          this.setNodeDetails(nodesDetails);
          return this._nodeDetails;
        } catch (error) {
          log.error("Failed to fetch node details from server, using local", error);
        }
      }

      const nodeDetails = this.fetchLocalConfig(this.network);
      if (!nodeDetails) {
        if (!verifier) {
          throw new Error(`Verifier is required in request body for ${this.network} network`);
        }
        if (!verifierId) {
          throw new Error(`Verifier is required in request body for ${this.network} network`);
        }
        const nodesDetails = await getLegacyNodeDetails({
          verifier,
          verifierId,
          network: this.network,
          proxyAddress: this._proxyContractAddress,
        });
        this.setNodeDetails(nodesDetails);
        return this._nodeDetails;
      }

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
