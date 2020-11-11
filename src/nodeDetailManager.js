import Web3EthContract from "web3-eth-contract";
import { toHex } from "web3-utils";

import { abi } from "./abi.json";

class NodeDetailManager {
  _currentEpoch = "19";

  _torusNodeEndpoints = [
    "https://torus-19.torusnode.com/jrpc",
    "https://torus-node.ens.domains/jrpc",
    "https://torus-node.matic.network/jrpc",
    "https://torus.zilliqa.network/jrpc",
    "https://torus-mainnet.cosmos.network/jrpc",
    "https://torus2.etherscan.com/jrpc",
    "https://torus-node-v2.skalelabs.com/jrpc",
    "https://torus-node.binancex.dev/jrpc",
    "https://torusnode.ont.io/jrpc",
  ];

  _torusNodePub = [
    {
      X: "bbe83c64177c3775550e6ba6ac2bc059f6847d644c9e4894e42c60d7974d8c2b",
      Y: "82b49a7caf70def38cdad2740af45c1e4f969650105c5019a29bb18b21a9acb5",
    },
    {
      X: "c208cac4ef9a47d386097a9c915b28e9cb89213abee8d26a17198ee261201b0d",
      Y: "c7db2fe4631109f40833de9dc78d07e35706549ee48fa557b33e4e75e1047873",
    },
    {
      X: "ca1766bb426d4ca5582818a0c5439d560ea64f5baa060793ab29dd3d0ceacfe",
      Y: "d46c1d08c40e1306e1bca328c2287b8268166b11a1ba4b8442ea2ad0c5e32152",
    },
    {
      X: "c3934dd2f6f4b3d2e1e398cc501e143c1e1a381b52feb6d1525af34d16253768",
      Y: "71f5141a5035799099f5ea3e241e66946bc55dc857ac3bd7d6fcdb8dcd3eeeef",
    },
    {
      X: "22e66f1929631d00bf026227581597f085fd94fd952fc0dca9f0833398b5c064",
      Y: "6088b3912e10a1e9d50355a609c10db7d188f16a2e2fd7357e51bf4f6a74f0a1",
    },
    {
      X: "9dc9fa410f3ce9eb70df70cdea00a49f2c4cc7a31c08c0dab5f863ed35ff5139",
      Y: "627a291cb87a75c61da3f65d6818e1e05e360217179817ed27e8c73bca7ec122",
    },
    {
      X: "118b9fc07e97b096d899b9f6658463ce6a8caa64038e37fc969df4e6023dd8c6",
      Y: "baf9fa4e51770f4796ea165dd03a769b8606681a38954a0a92c4cbffd6609ce9",
    },
    {
      X: "8a6d8b925da15a273dec3d8f8395ec35cd6878f274b2b180e4e106999db64043",
      Y: "96f67f870c157743da0b1eb84d89bf30500d74dc84c11f501ee1cb013acc8c46",
    },
    {
      X: "39cecb62e863729f572f7dfc46c24867981bf04bb405fed0df39e33984bfade5",
      Y: "61c2364434012e68a2be2e9952805037e52629d7762fafc8e10e9fb5bad8f790",
    },
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
