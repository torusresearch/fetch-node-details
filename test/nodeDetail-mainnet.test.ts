import { deepStrictEqual } from "assert";

import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsResponse, nodeDetailsStatic } from "./config";

describe("Fetch Node Details", function () {
  let nodeDetailManager: NodeDetailManager;

  beforeEach(function () {
    nodeDetailManager = new NodeDetailManager();
  });

  it("#should return correct values when not skipping - mainnet", async function () {
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsResponse);
  });
  it("#should return correct values when skipping - mainnet", async function () {
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us", skip: true });
    deepStrictEqual(details, nodeDetailsStatic);
  });
});
