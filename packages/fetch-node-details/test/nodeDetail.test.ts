import { METADATA_MAP, SIG_TYPE, TORUS_LEGACY_NETWORK, TORUS_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK } from "@toruslabs/constants";
import { getSapphireNodeDetails } from "@toruslabs/fnd-base";
import { deepStrictEqual, rejects, strictEqual, throws } from "assert";

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
    deepStrictEqual(details, getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.MAINNET));
    strictEqual(metadataUrl, METADATA_MAP[TORUS_LEGACY_NETWORK.MAINNET]);
  });

  it("#should return correct values - sapphire devnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    const compareNodeDetails = getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET);
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

  it("#should return correct values - celeste", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.CELESTE,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-celeste", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    deepStrictEqual(details, getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.CELESTE));
    strictEqual(metadataUrl, METADATA_MAP[TORUS_LEGACY_NETWORK.CELESTE]);
  });

  it("#should return correct values - testnet", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.TESTNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-lrc", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    deepStrictEqual(details, getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET, TORUS_LEGACY_NETWORK.TESTNET));
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

  it("#should throw error for invalid key type and sig type", async function () {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET,
      fndServerEndpoint,
      enableLogging: true,
    });

    const sigType = SIG_TYPE.ED25519;

    await rejects(
      async () => {
        await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us", keyType: "secp256k1", sigType });
      },
      (err) => {
        const error = err as Error;
        strictEqual(error.message, `Invalid key type for ${sigType}`);
        return true;
      }
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

  it("#should use override keytype and signType if provided", async function () {
    const nodeDetailManager = new NodeDetailManager({
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({
      verifier: "google",
      verifierId: "hello@tor.us",
      keyType: "ed25519",
      sigType: "ed25519",
    });
    delete details.updated;
    deepStrictEqual(details, getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, undefined, "ed25519", "ed25519"));

    const details2 = await nodeDetailManager.getNodeDetails({
      verifier: "google",
      verifierId: "hello@tor.us",
      keyType: "secp256k1",
      sigType: "bip340",
    });
    delete details2.updated;
    deepStrictEqual(details2, getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, undefined, "secp256k1", "bip340"));
  });
});
