import { deepStrictEqual } from "assert";

import { NETWORK_URLS, TORUS_NETWORK } from "../src";
import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsDevnet } from "./config";

describe("Fetch Node Details", function () {
  it("#should return correct values - devnet", async function () {
    const nodeDetailManager = new NodeDetailManager();
    const details = await nodeDetailManager.getNodeDetails();
    deepStrictEqual(details, nodeDetailsDevnet);
  });

  it("#should return correct values with custom endpoints", async function () {
    const nodeDetailManager = new NodeDetailManager({ customEndpoints: NETWORK_URLS[TORUS_NETWORK.DEVNET] });
    const details = await nodeDetailManager.getNodeDetails();
    deepStrictEqual(details, nodeDetailsDevnet);
  });
});
