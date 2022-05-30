import { deepStrictEqual } from "assert";

import { ETHEREUM_NETWORK } from "../src";
import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsPolygon, nodeDetailsResponse, nodeDetailsRopsten } from "./config";

describe("Fetch Node Details", function () {
  it("#should return correct values - mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager();
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsResponse);
  });

  it("#should return correct values - polygon", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: ETHEREUM_NETWORK.POLYGON,
      proxyAddress: "0x9f072ba19b3370e512aa1b4bfcdaf97283168005",
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsPolygon);
  });

  it("#should return correct values - ropsten", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: ETHEREUM_NETWORK.ROPSTEN,
      proxyAddress: "0x6258c9d6c12ed3edda59a1a6527e469517744aa7",
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsRopsten);
  });
});
