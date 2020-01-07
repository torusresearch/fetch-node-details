interface EpochInfo {
    id: String;
    n: String;
    k: String;
    t: String;
    nodeList: String[];
    prevEpoch: String;
    nextEpoch: String;
}

interface NodeInfo {
    declaredIp: String;
    position: String;
    tmP2PListenAddress: String;
    p2pListenAddress: String;
}

interface NodeDetails {
    currentEpoch: String;
    nodeListAddress: String;
    torusNodeEndpoints: String[];
    torusIndexes: Number[];
    updated: Boolean;
}

declare function getNodeDetails(skip?: Boolean): Promise<NodeDetails>;
declare function getNodeEndpoint(nodeEthAddress: String): Promise<NodeInfo>;
declare function getEpochInfo(epoch: Number): Promise<EpochInfo>;
declare function getCurrentEpoch(): Promise<String>;

export {
    getNodeDetails,
    getNodeEndpoint,
    getEpochInfo,
    getCurrentEpoch
};