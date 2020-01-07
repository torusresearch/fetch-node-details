const Web3EthContract = require("web3-eth-contract");
const config = require("./config");

Web3EthContract.setProvider(config.MAINNET_JRPC_URL);
const nodeListContract = new Web3EthContract(config.nodeListABI, config.proxyAddress);

const nodeDetails = {
  currentEpoch: 13,
  nodeListAddress: config.proxyAddress,
  torusNodeEndpoints: [
    "https://binance-main-13.torusnode.com/jrpc",
    "https://waseda-main-13.torusnode.com/jrpc",
    "https://vgr-main-13.torusnode.com/jrpc",
    "https://torus-main-13.torusnode.com/jrpc",
    "https://etc-main-13.torusnode.com/jrpc"
  ],
  torusIndexes: [1, 2, 3, 4, 5],
  updated: false
};

function getCurrentEpoch() {
  return nodeListContract.methods.currentEpoch().call();
}

function getEpochInfo(epoch) {
  return nodeListContract.methods.getEpochInfo(epoch).call();
}

function getNodeEndpoint(nodeEthAddress) {
  return nodeListContract.methods.getNodeDetails(nodeEthAddress).call();
}

function getNodeDetails(skip = false) {
  return new Promise((resolve, reject) => {
    if (skip) return resolve(nodeDetails);
    if (nodeDetails.updated) return resolve(nodeDetails);
    getCurrentEpoch()
      .then(latestEpoch => {
        nodeDetails.currentEpoch = latestEpoch;
        return getEpochInfo(latestEpoch);
      })
      .then(latestEpochInfo => {
        const nodeEndpointRequests = [];
        const indexes = latestEpochInfo.nodeList.map((_, pos) => {
          return pos + 1;
        });
        nodeDetails.torusIndexes = indexes;
        latestEpochInfo.nodeList.map(nodeEthAddress => {
          nodeEndpointRequests.push(getNodeEndpoint(nodeEthAddress));
        });
        return Promise.all(nodeEndpointRequests);
      })
      .then(nodeEndPoints => {
        const updatedNodeEndpoints = nodeEndPoints.map(x => {
          return `https://${x.declaredIp.split(":")[0]}/jrpc`;
        });
        nodeDetails.torusNodeEndpoints = updatedNodeEndpoints;
        nodeDetails.updated = true;
        resolve(nodeDetails);
      })
      .catch(_ => {
        resolve(nodeDetails);
      });
  });
}

module.exports = {
  getNodeDetails,
  getNodeEndpoint,
  getCurrentEpoch,
  getEpochInfo
};
