import { deepStrictEqual } from "assert";

import { ETHEREUM_NETWORK } from "../src/interfaces";
import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsRopsten } from "./config";

describe("Fetch Node Details Testnet", function () {
  let nodeDetailManager: NodeDetailManager;

  beforeEach(function () {
    nodeDetailManager = new NodeDetailManager({
      network: ETHEREUM_NETWORK.ROPSTEN,
      proxyAddress: "0x6258c9d6c12ed3edda59a1a6527e469517744aa7",
    });
  });

  it("#should return correct values when not skipping - ropsten", async function () {
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsRopsten);
  });
  it("#should return correct values when skipping - ropsten", async function () {
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us", skip: true });
    deepStrictEqual(details, nodeDetailsRopsten);
  });
});
