import Web3EthContract from "web3-eth-contract";
import { keccak256, toHex } from "web3-utils";

import { abi, ETHEREUM_NETWORK, INodeDetails, INodePub, NodeDetailManagerParams } from "./interfaces";

class NodeDetailManager {
  public static PROXY_ADDRESS_MAINNET = "0xf20336e16B5182637f09821c27BDe29b0AFcfe80";

  public static PROXY_ADDRESS_ROPSTEN = "0x6258c9d6c12ed3edda59a1a6527e469517744aa7";

  public static PROXY_ADDRESS_POLYGON = "0x9f072ba19b3370e512aa1b4bfcdaf97283168005";

  private _currentEpoch = "";

  private _torusNodeEndpoints: string[] = [];

  private _torusNodePub: INodePub[] = [];

  private _torusIndexes: number[] = [];

  private nodeListAddress: string;

  private updated: boolean;

  private nodeListContract: Web3EthContract.Contract;

  constructor({ network = ETHEREUM_NETWORK.MAINNET, proxyAddress = NodeDetailManager.PROXY_ADDRESS_MAINNET }: NodeDetailManagerParams = {}) {
    let url: string;
    try {
      const localUrl = new URL(network);
      url = localUrl.href;
    } catch (_) {
      const projectId = process.env.INFURA_PROJECT_ID;
      url = `https://${network}.infura.io/v3/${projectId}`;
    }
    Web3EthContract.setProvider(url);
    this.nodeListContract = new Web3EthContract(abi, proxyAddress);
    this.nodeListAddress = proxyAddress;
    this.updated = false;
  }

  get _nodeDetails(): INodeDetails {
    return {
      currentEpoch: this._currentEpoch,
      nodeListAddress: this.nodeListAddress,
      torusNodeEndpoints: this._torusNodeEndpoints,
      torusNodePub: this._torusNodePub,
      torusIndexes: this._torusIndexes,
      updated: this.updated,
    };
  }

  async getNodeDetails({ verifier, verifierId }: { verifier: string; verifierId: string }): Promise<INodeDetails> {
    try {
      // Do this only for mainnet & testnet where the list is static irrespective of verifier, verifierId
      if (
        this.updated &&
        (this.nodeListAddress === NodeDetailManager.PROXY_ADDRESS_MAINNET || this.nodeListAddress === NodeDetailManager.PROXY_ADDRESS_ROPSTEN)
      )
        return this._nodeDetails;
      const hashedVerifierId = keccak256(verifierId);
      const nodeDetails = await this.nodeListContract.methods.getNodeSet(verifier, hashedVerifierId).call();
      const { currentEpoch, torusNodeEndpoints, torusNodePubX, torusNodePubY, torusIndexes } = nodeDetails;
      this._currentEpoch = currentEpoch;
      this._torusIndexes = torusIndexes.map((x: string) => Number(x));
      const updatedEndpoints: string[] = [];
      const updatedNodePub: INodePub[] = [];
      for (let index = 0; index < torusNodeEndpoints.length; index += 1) {
        const endPointElement = torusNodeEndpoints[index];
        const pubKx = torusNodePubX[index];
        const pubKy = torusNodePubY[index];
        const endpoint = `https://${endPointElement.split(":")[0]}/jrpc`;
        updatedEndpoints.push(endpoint);
        updatedNodePub.push({ X: toHex(pubKx).replace("0x", ""), Y: toHex(pubKy).replace("0x", "") });
      }
      this._torusNodeEndpoints = updatedEndpoints;
      this._torusNodePub = updatedNodePub;
      this.updated = true;
      return this._nodeDetails;
    } catch (error) {
      if (this.nodeListAddress === NodeDetailManager.PROXY_ADDRESS_MAINNET) {
        return this._nodeDetails;
      }
      throw error;
    }
  }
}

export default NodeDetailManager;
