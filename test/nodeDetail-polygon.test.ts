import { deepStrictEqual } from "assert";

import { ETHEREUM_NETWORK } from "../src/interfaces";
import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsPolygon } from "./config";

describe("Fetch Node Details Polygon", function () {
  let nodeDetailManager: NodeDetailManager;

  beforeEach(function () {
    nodeDetailManager = new NodeDetailManager({
      network: ETHEREUM_NETWORK.POLYGON,
      proxyAddress: "0x9f072ba19b3370e512aa1b4bfcdaf97283168005",
    });
  });

  it("#should return correct values when not skipping - polygon", async function () {
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsPolygon);
  });
  it("#should return correct values when skipping - polygon", async function () {
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us", skip: true });
    deepStrictEqual(details, nodeDetailsPolygon);
  });
});
