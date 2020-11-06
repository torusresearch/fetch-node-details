import Web3EthContract from "web3-eth-contract";
import { toHex } from "web3-utils";

import { abi } from "./abi.json";

class NodeDetailManager {
  _currentEpoch = "18";

  _torusNodeEndpoints = [
    "https://torus-18.torusnode.com/jrpc",
    "https://torus.ont.io/jrpc",
    "https://torus.binancex.dev/jrpc",
    "https://torus.matic.network/jrpc",
    "https://torusnode.zilliqa.network/jrpc",
    "https://torus.ens.domains/jrpc",
    "https://torus-node.skalelabs.com/jrpc",
    "https://torus.cosmos.network/jrpc",
    "https://torus.etherscan.com/jrpc",
  ];

  _torusNodePub = [
    { X: "ecbe4a29e02bb9c077433191051ba74d2458a7ebce95a3183a4201338376539f", Y: "114018f97e6576f3fe1c247fc6802de3ff219507589a90544e6921ea9608adcf" },
    { X: "c1d31f5b0ba633ad5dec80c35df7209ffe282392831f5d3a386d3c5c0c6b4c2b", Y: "2490a3e69ac1d5a6c3170b5dc4947f038bf37a738cc279d75c18b6a85c90bc71" },
    { X: "a6d83cc23847dec596d19e93801a0d67ee85f4b1e5f44f267a7118a0c01381ef", Y: "f4b16a19ba44766d53cfaa8fe5858d87c842c7ec0c7b6ecdf11056e6afbeb726" },
    { X: "79242c54fcfda56c914a28ae89b038dcae8ef2e9dd295171d5562f01d396fbb", Y: "519c655678bf9f6091aa17d0bc13443b69fe8b10ba9336c7cc966a2164eec9e4" },
    { X: "24b3f3582397f4f4274510e94d8e95fa1a17d57fab2e581d4da1dd2ba61c47d2", Y: "fa15e5cd538992c74cbca5fc1c654ab4d79fb40e2cf5ec58190c35252d81bb6" },
    { X: "a08620e79b5c006f261b5221e0fae75d379fd0fcd16c66ced105b3fe5282ed64", Y: "e589aa09a7ac28a74d4f4cf7f52718dd9c3cca0541070eec36c66e62a748b17" },
    { X: "17b5b8402eb27b520eaf4697c7ca3e4818bc79c6cedb6c39490da18602cd84a9", Y: "f18768b68383b8fa9a91caa55768fd7bdec64c8c01cc2fa88963fc6fe92775a6" },
    { X: "47953df2031bf785f95158a1753a65735fecc93a0248620c4afd7b08ddf239e2", Y: "8058bf6928e7d49179d08cc354d3d735dd08be2f0aa6023d8a7298bb892cf65" },
    { X: "e53c29bd04eb211d911d78ebcd36d3645872d8f8a18af4fb1937fb2a1f049078", Y: "91ace383afb055ce304ccc5ee811fd8e7407c93e8e0d63d993fc08affc646045" },
  ];

  _torusIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor({ network = "mainnet", proxyAddress = "0x638646503746d5456209e33a2ff5e3226d698bea" } = {}) {
    let url;
    try {
      const localUrl = new URL(network);
      url = localUrl.href;
    } catch (_) {
      url = `https://api.infura.io/v1/jsonrpc/${network}`;
    }
    Web3EthContract.setProvider(url);
    this.nodeListContract = new Web3EthContract(abi, proxyAddress);
    this.nodeListAddress = proxyAddress;
    this.updated = false;
  }

  get _nodeDetails() {
    return {
      currentEpoch: this._currentEpoch,
      nodeListAddress: this.nodeListAddress,
      torusNodeEndpoints: this._torusNodeEndpoints,
      torusNodePub: this._torusNodePub,
      torusIndexes: this._torusIndexes,
      updated: this.updated,
    };
  }

  getCurrentEpoch() {
    return this.nodeListContract.methods.currentEpoch().call();
  }

  getEpochInfo(epoch) {
    return this.nodeListContract.methods.getEpochInfo(epoch).call();
  }

  getNodeEndpoint(nodeEthAddress) {
    return this.nodeListContract.methods.getNodeDetails(nodeEthAddress).call();
  }

  async getNodeDetails(skip = false) {
    try {
      if (skip) return this._nodeDetails;
      if (this.updated) return this._nodeDetails;
      const latestEpoch = await this.getCurrentEpoch();
      this._currentEpoch = latestEpoch;
      const latestEpochInfo = await this.getEpochInfo(latestEpoch);
      const nodeEndpointRequests = [];
      const indexes = latestEpochInfo.nodeList.map((_, pos) => pos + 1);
      this._torusIndexes = indexes;
      latestEpochInfo.nodeList.map((nodeEthAddress) => nodeEndpointRequests.push(this.getNodeEndpoint(nodeEthAddress).catch((_) => {})));
      const nodeEndPoints = await Promise.all(nodeEndpointRequests);
      const updatedEndpoints = [];
      const updatedNodePub = [];
      for (let index = 0; index < nodeEndPoints.length; index += 1) {
        const endPointElement = nodeEndPoints[index];
        const endpoint = `https://${endPointElement.declaredIp.split(":")[0]}/jrpc`;
        updatedEndpoints.push(endpoint);
        updatedNodePub.push({ X: toHex(endPointElement.pubKx).replace("0x", ""), Y: toHex(endPointElement.pubKy).replace("0x", "") });
      }
      this._torusNodeEndpoints = updatedEndpoints;
      this._torusNodePub = updatedNodePub;
      this.updated = true;
      return this._nodeDetails;
    } catch (_) {
      return this._nodeDetails;
    }
  }
}

export default NodeDetailManager;
