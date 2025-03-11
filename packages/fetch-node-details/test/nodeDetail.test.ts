import { METADATA_MAP, TORUS_LEGACY_NETWORK, TORUS_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK } from "@toruslabs/constants";
import { getSapphireNodeDetails } from "@toruslabs/fnd-base";
import { describe, expect, it } from "vitest";

import NodeDetailManager from "../src/nodeDetailManager";

const fndServerEndpoint = "http://localhost:8060/node-details";

describe("Fetch Node Details", () => {
  it("should return correct values - mainnet", async () => {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.MAINNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    expect(details).toEqual(getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.MAINNET));
    expect(metadataUrl).toBe(METADATA_MAP[TORUS_LEGACY_NETWORK.MAINNET]);
  });

  it("should return correct values - sapphire devnet", async () => {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    const compareNodeDetails = getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET);
    expect(details).toEqual(compareNodeDetails);
    expect(metadataUrl).toBe(compareNodeDetails.torusNodeEndpoints[0].replace("/sss/jrpc", "/metadata"));
  });

  it("should return correct values - sapphire mainnet", async () => {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    const compareNodeDetails = getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET);
    expect(details).toEqual(compareNodeDetails);
    expect(metadataUrl).toBe(compareNodeDetails.torusNodeEndpoints[0].replace("/sss/jrpc", "/metadata"));
  });

  it("should return correct values - cyan", async () => {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.CYAN,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-cyan", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    expect(details).toEqual(getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.CYAN));
    expect(metadataUrl).toBe(METADATA_MAP[TORUS_LEGACY_NETWORK.CYAN]);
  });

  it("should return correct values - aqua", async () => {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.AQUA,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-aqua", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    expect(details).toEqual(getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.AQUA));
    expect(metadataUrl).toBe(METADATA_MAP[TORUS_LEGACY_NETWORK.AQUA]);
  });

  it("should return correct values - celeste", async () => {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.CELESTE,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-celeste", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    expect(details).toEqual(getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET, TORUS_LEGACY_NETWORK.CELESTE));
    expect(metadataUrl).toBe(METADATA_MAP[TORUS_LEGACY_NETWORK.CELESTE]);
  });

  it("should return correct values - testnet", async () => {
    const nodeDetailManager = new NodeDetailManager({
      network: TORUS_LEGACY_NETWORK.TESTNET,
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google-lrc", verifierId: "hello@tor.us" });
    delete details.updated;
    const metadataUrl = await nodeDetailManager.getMetadataUrl();
    expect(details).toEqual(getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET, TORUS_LEGACY_NETWORK.TESTNET));
    expect(metadataUrl).toBe(METADATA_MAP[TORUS_LEGACY_NETWORK.TESTNET]);
  });

  it("should throw error for invalid network", () => {
    expect(() => {
      const nodeDetailManager = new NodeDetailManager({
        network: "INVALID_NETWORK" as TORUS_NETWORK_TYPE,
        fndServerEndpoint,
        enableLogging: true,
      });
      return nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    }).toThrow("Invalid network");
  });

  it("should use default network if not provided", async () => {
    const nodeDetailManager = new NodeDetailManager({
      fndServerEndpoint,
      enableLogging: true,
    });
    const details = await nodeDetailManager.getNodeDetails({ verifier: "google", verifierId: "hello@tor.us" });
    delete details.updated;
    expect(details).toEqual(getSapphireNodeDetails(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET));
  });
});
