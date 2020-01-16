import Web3EthContract from "web3-eth-contract";
import { toHex } from "web3-utils";

import { abi } from "./abi.json";

class NodeDetailManager {
  _currentEpoch = "13";

  _torusNodeEndpoints = [
    "https://binance-main-13.torusnode.com/jrpc",
    "https://waseda-main-13.torusnode.com/jrpc",
    "https://vgr-main-13.torusnode.com/jrpc",
    "https://torus-main-13.torusnode.com/jrpc",
    "https://etc-main-13.torusnode.com/jrpc"
  ];

  _torusNodePub = [
    {
      X: "801e99d5c6befe4286de6f22b086508c02ae5730afabf15f316242238fa8c832",
      Y: "a4791de3ebd17197d09d7a52d417994e7fdab17f8de002fc139c90dfdebfe7e1"
    },
    {
      X: "f4034ed9b11a3573d496b09823f69efed1213bc903f0b520652cb1b80f72e5c3",
      Y: "c1619b0d594db4bb289b2ec18c029e777b1e04aa0493f7318d14a68e89ff0005"
    },
    {
      X: "10aeb138801ef2e189e21a016e913fc2c2d40463e90e09687c6cef011e64048d",
      Y: "1dbc9e567db833376cac16ad07b402d44458befb26125e98446270d41e759a99"
    },
    {
      X: "1a864642b3e612615c0db4999cc89e123b7ab6bafe58b1692d46b64ba27508f6",
      Y: "92919c5269b22818a9e62d246df282b7847782e46f94d775d8d20fe967fb5cab"
    },
    {
      X: "9b64f7f8db105bb5a9301ac7ab20958e6d71f4a231f0d29b431712dd61d767a7",
      Y: "ee7de7de555aea2e586c9b40e68fab778742c0a8871e8b8f88a97063822764b4"
    }
  ];

  _torusIndexes = [1, 2, 3, 4, 5];

  constructor({ network = "mainnet", proxyAddress = "0x638646503746d5456209e33a2ff5e3226d698bea" } = {}) {
    let url;
    try {
      const localUrl = new URL(network);
      url = localUrl.href;
    } catch (_) {
      url = `https://api.infura.io/v1/jsonrpc/${network}`;
    }
    try {
      Web3EthContract.setProvider(url);
      this.nodeListContract = new Web3EthContract(abi, proxyAddress);
      this.nodeListAddress = proxyAddress;
      this.updated = false;
    } catch (error) {
      throw new Error(error);
    }
  }

  get _nodeDetails() {
    return {
      currentEpoch: this._currentEpoch,
      nodeListAddress: this.nodeListAddress,
      torusNodeEndpoints: this._torusNodeEndpoints,
      torusNodePub: this._torusNodePub,
      torusIndexes: this._torusIndexes,
      updated: this.updated
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

  getNodeDetails(skip = false) {
    return new Promise((resolve, reject) => {
      if (skip) return resolve(this._nodeDetails);
      if (this.updated) return resolve(this._nodeDetails);
      this.getCurrentEpoch()
        .then(latestEpoch => {
          this._currentEpoch = latestEpoch;
          return this.getEpochInfo(latestEpoch);
        })
        .then(latestEpochInfo => {
          const nodeEndpointRequests = [];
          const indexes = latestEpochInfo.nodeList.map((_, pos) => {
            return pos + 1;
          });
          this._torusIndexes = indexes;
          latestEpochInfo.nodeList.map(nodeEthAddress => {
            nodeEndpointRequests.push(this.getNodeEndpoint(nodeEthAddress).catch(_ => {}));
          });
          return Promise.all(nodeEndpointRequests);
        })
        .then(nodeEndPoints => {
          const updatedEndpoints = [];
          const updatedNodePub = [];
          for (let index = 0; index < nodeEndPoints.length; index++) {
            const endPointElement = nodeEndPoints[index];
            const endpoint = `https://${endPointElement.declaredIp.split(":")[0]}/jrpc`;
            updatedEndpoints.push(endpoint);
            updatedNodePub.push({ X: toHex(endPointElement.pubKx).replace("0x", ""), Y: toHex(endPointElement.pubKy).replace("0x", "") });
          }
          this._torusNodeEndpoints = updatedEndpoints;
          this._torusNodePub = updatedNodePub;
          this.updated = true;
          resolve(this._nodeDetails);
        })
        .catch(_ => resolve(this._nodeDetails));
    });
  }
}

export default NodeDetailManager;
