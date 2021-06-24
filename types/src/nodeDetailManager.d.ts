import Web3EthContract from "web3-eth-contract";
import { INodeDetails, INodeEndpoint, INodePub } from "./utils";
declare class NodeDetailManager {
    _currentEpoch: string;
    _torusNodeEndpoints: string[];
    _torusNodePub: INodePub[];
    _torusIndexes: number[];
    _network: string;
    nodeListAddress: string;
    updated: boolean;
    nodeListContract: Web3EthContract.Contract;
    constructor({ network, proxyAddress }?: {
        network?: string;
        proxyAddress?: string;
    });
    get _nodeDetails(): INodeDetails;
    getCurrentEpoch(): Promise<string>;
    getEpochInfo(epoch: string): Promise<{
        nodeList: string[];
    }>;
    getNodeEndpoint(nodeEthAddress: string): Promise<INodeEndpoint>;
    getNodeDetails(skip?: boolean, skipPostEpochCheck?: boolean): Promise<INodeDetails>;
}
export default NodeDetailManager;
