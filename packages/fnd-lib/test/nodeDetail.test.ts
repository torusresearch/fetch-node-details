import { NODE_DETAILS_DEVNET } from "@toruslabs/fnd-base";
import { deepStrictEqual } from "assert";

import NodeDetailManager from "../src/nodeDetailManager";

describe("Fetch Node Details", function () {
  it("#should return correct values - devnet", async function () {
    const nodeDetailManager = new NodeDetailManager();
    const details = await nodeDetailManager.getNodeDetails({});
    delete details.updated;
    deepStrictEqual(details, NODE_DETAILS_DEVNET);
  });
});
