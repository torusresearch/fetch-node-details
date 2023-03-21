import { NODE_DETAILS_MAINNET, NODE_DETAILS_SAPPHIRE_DEVNET, PROXY_CONTRACT_ADDRESS, TORUS_NETWORK } from "@toruslabs/fnd-base";
import { deepStrictEqual } from "assert";

import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsAqua, nodeDetailsCeleste, nodeDetailsCyan } from "./config";

const fndServerEndpoint = "http://localhost:8060/nodesDetails";

describe("Fetch Node Details", function () {
  it("#should return correct values - mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager({ fndServerEndpoint: "http://localhost:8060/nodesDetails" });
    const details = await nodeDetailManager.getNodeDetails({});
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, NODE_DETAILS_MAINNET);
  });
  it("#should return correct values - devnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.SAPPHIRE_DEVNET,
      fndServerEndpoint,
    });
    const details = await nodeDetailManager.getNodeDetails({});
    delete details.updated;
    deepStrictEqual(details, NODE_DETAILS_SAPPHIRE_DEVNET);
  });

  it("#should return correct values on skipping server - devnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.SAPPHIRE_DEVNET,
      fndServerEndpoint,
    });
    const details = await nodeDetailManager.getNodeDetails({ skipServer: true });
    delete details.updated;
    deepStrictEqual(details, NODE_DETAILS_SAPPHIRE_DEVNET);
  });

  it("#should return correct values - cyan", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.CYAN,
      proxyAddress: PROXY_CONTRACT_ADDRESS[TORUS_NETWORK.CYAN],
      fndServerEndpoint,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsCyan);
  });
  it("#should return correct value when skipped server - cyan", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.CYAN,
      proxyAddress: PROXY_CONTRACT_ADDRESS[TORUS_NETWORK.CYAN],
      fndServerEndpoint,
    });
    const details = await nodeDetailManager.getNodeDetails({ skipServer: true, verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsCyan);
  });

  it("#should return correct values - aqua", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.AQUA,
      proxyAddress: PROXY_CONTRACT_ADDRESS[TORUS_NETWORK.AQUA],
      fndServerEndpoint,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsAqua);
  });
  it("#should return correct value when skipped server - aqua", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.AQUA,
      proxyAddress: PROXY_CONTRACT_ADDRESS[TORUS_NETWORK.AQUA],
      fndServerEndpoint,
    });
    const details = await nodeDetailManager.getNodeDetails({ skipServer: true, verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsAqua);
  });

  it("#should return correct values - celeste", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.CELESTE,
      proxyAddress: PROXY_CONTRACT_ADDRESS[TORUS_NETWORK.CELESTE],
      fndServerEndpoint,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsCeleste);
  });
  it("#should return correct value when skipped server - celeste", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.CELESTE,
      proxyAddress: PROXY_CONTRACT_ADDRESS[TORUS_NETWORK.CELESTE],
      fndServerEndpoint,
    });
    const details = await nodeDetailManager.getNodeDetails({ skipServer: true, verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsCeleste);
  });
});
