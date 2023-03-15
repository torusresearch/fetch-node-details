import { INodeDetails, NodeDetailManagerParams } from "./interfaces";
declare class NodeDetailManager {
    static NODE_DETAILS_DEVNET: INodeDetails;
    private _torusNodeBaseEndpoints;
    private _torusNodeRSSEndpoints;
    private _torusNodeSSSEndpoints;
    private _torusNodeTSSEndpoints;
    private _torusNodePub;
    private _torusIndexes;
    private updated;
    private network;
    constructor({ network }?: NodeDetailManagerParams);
    get _nodeDetails(): INodeDetails;
    getNodeDetails(): Promise<INodeDetails>;
}
export default NodeDetailManager;
