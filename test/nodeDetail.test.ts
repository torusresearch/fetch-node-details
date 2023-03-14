import { deepStrictEqual } from "assert";

import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsDevnet } from "./config";

describe("Fetch Node Details", function () {
  it("#should return correct values - devnet", async function () {
    const nodeDetailManager = new NodeDetailManager();
    const details = await nodeDetailManager.getNodeDetails();
    deepStrictEqual(details, nodeDetailsDevnet);
  });
});
