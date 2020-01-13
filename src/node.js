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
  torusNodePub: [
    {
      X: "57950111761191552097724757179303771667822761128880477488391496396179717539890",
      Y: "74393301957880371258837374004285808472861444745937163848782001554220591867873"
    },
    {
      X: "110370179800685867651497013605449859866049852314955093481972892310438566618563",
      Y: "87468834072421735791258187150311839702365940964147928759165987527582925389829"
    },
    {
      X: "7545660098956801290037601316552639716104428134250064436201208478654091494541",
      Y: "13450332664811079770773409184136555964428902874670120523449266646930941123225"
    },
    {
      X: "11997376490391531226016453830943820521378269751826233298351115247528023754998",
      Y: "66294947611826564474935633246675366812551918389958104434032262879263911009451"
    },
    {
      X: "70286887677368680618746965874482632194823771335116228622050520165411276154791",
      Y: "107872914143417912160510274747999612735843562429421664781783714364842029049012"
    }
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
        const updatedEndpoints = [];
        const updatedNodePub = [];
        for (let index = 0; index < nodeEndPoints.length; index++) {
          const endPointElement = nodeEndPoints[index];
          const endpoint = `https://${endPointElement.declaredIp.split(":")[0]}/jrpc`;
          updatedEndpoints.push(endpoint);
          updatedNodePub.push({ X: endPointElement.pubKx, Y: endPointElement.pubKy });
        }
        nodeDetails.torusNodeEndpoints = updatedEndpoints;
        nodeDetails.torusNodePub = updatedNodePub;
        nodeDetails.updated = true;
        resolve(nodeDetails);
      })
      .catch(_ => resolve(nodeDetails));
  });
}

module.exports = {
  getNodeDetails,
  getNodeEndpoint,
  getCurrentEpoch,
  getEpochInfo
};
