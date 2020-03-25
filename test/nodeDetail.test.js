import { deepStrictEqual } from "assert";
import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsResponse, nodeDetailsStatic, nodeDetailsRopsten } from "./config";

describe("Fetch Node Details", function () {
  it("#should return correct values when not skipping - mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager();
    const details = await nodeDetailManager.getNodeDetails();
    deepStrictEqual(details, nodeDetailsResponse);
  });
  it("#should return correct values when skipping - mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager();
    const details = await nodeDetailManager.getNodeDetails(true);
    deepStrictEqual(details, nodeDetailsStatic);
  });
  it("#should return correct values when not skipping - ropsten", async function () {
    const nodeDetailManager = new NodeDetailManager({ network: "ropsten", proxyAddress: "0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183" });
    const details = await nodeDetailManager.getNodeDetails();
    deepStrictEqual(details, nodeDetailsRopsten);
  });
});
