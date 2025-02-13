import { TEST_VERIFIERS, TORUS_LEGACY_NETWORK, TORUS_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK } from "@toruslabs/constants";
import crypto from "crypto";
const trackingEnabled = process.env.TRACKING_ENABLED;
export const isTrackingEnabled = (verifier: string, network: TORUS_NETWORK_TYPE) => {
  if (
    trackingEnabled === "true" ||
    TEST_VERIFIERS.includes(verifier) ||
    network === TORUS_LEGACY_NETWORK.TESTNET ||
    network === TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET
  ) {
    return true;
  }
  return false;
};

export const getTrackingId = (verifier: string, verifierId: string, network: TORUS_NETWORK_TYPE) => {
  if (!isTrackingEnabled(verifier, network)) {
    return undefined;
  }
  // hash the verifier and verifierId
  const hash = crypto.createHash("sha256").update(`${verifier.toLowerCase()}:${verifierId.toLowerCase()}`).digest("hex");
  return hash;
};
