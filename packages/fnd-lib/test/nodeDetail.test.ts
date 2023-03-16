import { NODE_DETAILS_DEVNET } from "@toruslabs/fnd-base";
import { deepStrictEqual } from "assert";

import NodeDetailManager from "../src/nodeDetailManager";

describe("Fetch Node Details", function () {
  it("#should return correct values - devnet", async function () {
    const nodeDetailManager = new NodeDetailManager({ fndServerEndpoint: "http://localhost:8060/nodesDetails" });
    const details = await nodeDetailManager.getNodeDetails({});
    delete details.updated;
    deepStrictEqual(details, NODE_DETAILS_DEVNET);
  });

  it("#should return correct values on skipping server - devnet", async function () {
    const nodeDetailManager = new NodeDetailManager({ fndServerEndpoint: "http://localhost:8060/nodesDetails" });
    const details = await nodeDetailManager.getNodeDetails({ skipServer: true });
    delete details.updated;
    deepStrictEqual(details, NODE_DETAILS_DEVNET);
  });
});
