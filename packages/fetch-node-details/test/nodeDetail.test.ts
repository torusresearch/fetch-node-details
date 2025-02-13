import { METADATA_MAP, TORUS_LEGACY_NETWORK, TORUS_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK } from "@toruslabs/constants";
import { getSapphireNodeDetails } from "@toruslabs/fnd-base";
import { deepStrictEqual, strictEqual, throws } from "assert";

import NodeDetailManager from "../src/nodeDetailManager";

const fndServerEndpoint = "http://localhost:8060/node-details";

describe("Fetch Node Details", function () {
  it("#should return correct values - mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.MAINNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });

    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    const expectedDetails = getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.MAINNET);
    deepStrictEqual(details, expectedDetails);
    strictEqual(metadataUrl, METADATA_MAP[TORUS_LEGACY_NETWORK.MAINNET]);
  });

  it("#should return correct values - sapphire devnet", async function () {
    const trackingId = "eea55f6dede3377be2ba5e8e5839a84afcdb9e6447ad0265";
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us", trackingId });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    const compareNodeDetails = getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET, undefined, undefined, undefined, trackingId);
    deepStrictEqual(details, compareNodeDetails);
    strictEqual(metadataUrl, compareNodeDetails.torusNodeEndpoints[0].replace("/sss/jrpc", "/metadata"));
  });

  it("#should return correct values - sapphire mainnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    const compareNodeDetails = getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET);
    deepStrictEqual(details, compareNodeDetails);
    strictEqual(metadataUrl, compareNodeDetails.torusNodeEndpoints[0].replace("/sss/jrpc", "/metadata"));
  });

  it("#should return correct values - cyan", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.CYAN,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-cyan", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    deepStrictEqual(details, getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.CYAN));
    strictEqual(metadataUrl, METADATA_MAP[TORUS_LEGACY_NETWORK.CYAN]);
  });

  it("#should return correct values - aqua", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.AQUA,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-aqua", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    deepStrictEqual(details, getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.AQUA));
    strictEqual(metadataUrl, METADATA_MAP[TORUS_LEGACY_NETWORK.AQUA]);
  });

  it("#should return correct values - testnet", async function () {
    const trackingId = "26a8e90f2414039ad745514413591b51e697fce81091cc58";

    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.TESTNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-lrc", verifierId: "hello@tor.us", trackingId });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    deepStrictEqual(
      details,
      getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET, TORUS_LEGACY_NETWORK.TESTNET, undefined, undefined, trackingId)
    );
    strictEqual(metadataUrl, METADATA_MAP[TORUS_LEGACY_NETWORK.TESTNET]);
  });

  it("#should throw error for invalid network", async function () {
    throws(
      () => {
        const nodeDetailManager = new NodeDetailManager({
          network: "INVALID_NETWORK" as TORUS_NETWORK_TYPE,
          fndServerEndpoint,
          enableLogging: true,
        });
        return nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
      },
      Error,
      "Invalid network"
    );
  });

  it("#should use default network if not provided", async function () {
    const nodeDetailManager = new NodeDetailManager({
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    deepStrictEqual(details, getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET));
  });
});
