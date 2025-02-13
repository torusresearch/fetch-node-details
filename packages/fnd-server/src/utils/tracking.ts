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
  // to differentiate between requests
  const randomId = crypto.randomBytes(16).toString("hex");
  // user's all request can be tracked by this id
  const userID = crypto.createHash("sha256").update(`${verifier.toLowerCase()}:${verifierId.toLowerCase()}`).digest("hex").slice(0, 16);
  // a specific request can be tracked by this id
  const trackingId = userID.concat(randomId);
  return trackingId;
};
