import { deepStrictEqual } from "assert";

import { TORUS_NETWORK } from "../src";
import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsAqua, nodeDetailsCeleste, nodeDetailsCyan, nodeDetailsMainnet, nodeDetailsTestnet } from "./config";

describe("Fetch Node Details", function () {
  it("#should return correct values - mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager();
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsMainnet);
  });

  it("#should return correct values - cyan", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.CYAN,
      proxyAddress: NodeDetailManager.PROXY_ADDRESS_CYAN,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsCyan);
  });

  it("#should return correct values - testnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.TESTNET,
      proxyAddress: NodeDetailManager.PROXY_ADDRESS_TESTNET,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsTestnet);
  });

  it("#should return correct values - aqua", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.AQUA,
      proxyAddress: NodeDetailManager.PROXY_ADDRESS_AQUA,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsAqua);
  });

  it("#should return correct values - celeste", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.CELESTE,
      proxyAddress: NodeDetailManager.PROXY_ADDRESS_CELESTE,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    deepStrictEqual(details, nodeDetailsCeleste);
  });
});
