import { TORUS_NETWORK } from "@toruslabs/constants";
import {
  NODE_DETAILS_MAINNET,
  NODE_DETAILS_SAPPHIRE_DEVNET,
  NODE_DETAILS_SAPPHIRE_MAINNET,
  // NODE_DETAILS_SAPPHIRE_TESTNET,
  NODE_DETAILS_TESTNET,
} from "@toruslabs/fnd-base";
import { deepStrictEqual } from "assert";

import NodeDetailManager from "../src/nodeDetailManager";
import { nodeDetailsAqua, nodeDetailsCeleste, nodeDetailsCyan } from "./config";

const fndServerEndpoint = "http://localhost:8060/node-details";

describe("Fetch Node Details", function () {
  it("#should return correct values - mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, NODE_DETAILS_MAINNET);
  });
  it("#should return correct values - sapphire devnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.SAPPHIRE_DEVNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    deepStrictEqual(details, NODE_DETAILS_SAPPHIRE_DEVNET);
  });

  // it("#should return correct values - sapphire testnet", async function () {
  //   const nodeDetailManager = new NodeDetailManager({
  //     network: TORUS_NETWORK.SAPPHIRE_TESTNET,
  //     fndServerEndpoint,
  //     enableLogging: true,
  //   });
  //   const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
  //   delete details.updated;
  //   deepStrictEqual(details, NODE_DETAILS_SAPPHIRE_TESTNET);
  // });

  it("#should return correct values - sapphire mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.SAPPHIRE_MAINNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    deepStrictEqual(details, NODE_DETAILS_SAPPHIRE_MAINNET);
  });

  it("#should return correct values - cyan", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.CYAN,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-cyan", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsCyan);
  });

  it("#should return correct values - aqua", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.AQUA,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-aqua", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsAqua);
  });

  it("#should return correct values - celeste", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.CELESTE,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-celeste", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, nodeDetailsCeleste);
  });

  it("#should return correct values - testnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_NETWORK.TESTNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-lrc", verifierId: "hello@tor.us" });
    delete details.updated;
    delete details.torusNodeRSSEndpoints;
    delete details.torusNodeSSSEndpoints;
    delete details.torusNodeTSSEndpoints;
    deepStrictEqual(details, NODE_DETAILS_TESTNET);
  });
});
