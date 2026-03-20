import {
  BUILD_ENV,
  BUILD_ENV_TYPE,
  FND_SERVER_MAP,
  INodeDetails,
  INodePub,
  KEY_TYPE,
  LEGACY_METADATA_MAP,
  SIG_TYPE,
  TORUS_LEGACY_NETWORK,
  TORUS_LEGACY_NETWORK_TYPE,
  TORUS_NETWORK_TYPE,
  TORUS_SAPPHIRE_NETWORK,
  WEB3AUTH_KEY_TYPE,
  WEB3AUTH_SIG_TYPE,
} from "@toruslabs/constants";
import { fetchLocalConfig } from "@toruslabs/fnd-base";
import { get } from "@toruslabs/http-helpers";
import logger from "loglevel";

import { NodeDetailManagerParams } from "./interfaces";

const log = logger.getLogger("fnd");

class NodeDetailManager {
  private fndServerEndpoint: string;

  private _currentEpoch = "1";

  private _keyType: WEB3AUTH_KEY_TYPE;

  private _sigType: WEB3AUTH_SIG_TYPE;

  private _torusNodeEndpoints: string[] = [];

  private _torusNodeRSSEndpoints: string[] = [];

  private _torusNodeSSSEndpoints: string[] = [];

  private _torusNodeTSSEndpoints: string[] = [];

  private _torusNodePub: INodePub[] = [];

  private _torusIndexes: number[] = [];

  private updated: boolean;

  private network: TORUS_NETWORK_TYPE;

  private buildEnv: BUILD_ENV_TYPE;

  constructor({
    network = TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET,
    keyType = KEY_TYPE.SECP256K1,
    sigType = SIG_TYPE.ECDSA_SECP256K1,
    fndServerEndpoint,
    enableLogging = false,
    buildEnv = BUILD_ENV.PRODUCTION,
  }: NodeDetailManagerParams = {}) {
    if (network && !Object.values({ ...TORUS_LEGACY_NETWORK, ...TORUS_SAPPHIRE_NETWORK }).includes(network as TORUS_LEGACY_NETWORK_TYPE)) {
      throw new Error("Invalid network");
    }
    this.network = network;
    this.buildEnv = buildEnv;
    this._keyType = keyType;
    this._sigType = sigType;
    this.updated = false;
    if (fndServerEndpoint) {
      this.fndServerEndpoint = fndServerEndpoint;
    } else {
      this.fndServerEndpoint = `${FND_SERVER_MAP[buildEnv]}/node-details`;
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
      if (this.updated) return this._nodeDetails;

      try {
        const { nodeDetails } = await get<{ nodeDetails: INodeDetails }>(
          `${this.fndServerEndpoint}?network=${this.network}&verifier=${verifier}&verifierId=${verifierId}&keyType=${this._keyType}&sigType=${this._sigType}`
        );
        this.setNodeDetails(nodeDetails);

        return this._nodeDetails;
      } catch (error) {
        log.error("Failed to fetch node details from server, using local.", error);
      }

      const nodeDetails = fetchLocalConfig(this.network as TORUS_NETWORK_TYPE, this._keyType, this._sigType);
      if (!nodeDetails) throw new Error("Failed to fetch node details");
      this.setNodeDetails(nodeDetails);
      return this._nodeDetails;
    } catch (error) {
      log.error("Failed to fetch node details", error);
      throw error;
    }
  }

  async getMetadataUrl(): Promise<string> {
    if (Object.values(TORUS_LEGACY_NETWORK).includes(this.network as TORUS_LEGACY_NETWORK_TYPE)) {
      return LEGACY_METADATA_MAP[this.buildEnv];
    }
    const nodeDetails = await this.getNodeDetails({ verifier: "test-verifier", verifierId: "test-verifier-id" });
    return nodeDetails.torusNodeEndpoints[0].replace("/sss/jrpc", "/metadata");
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
