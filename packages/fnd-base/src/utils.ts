import {
  INodeDetails,
  KEY_TYPE,
  LEGACY_NETWORKS_ROUTE_MAP,
  SIG_TYPE,
  TORUS_LEGACY_NETWORK,
  TORUS_LEGACY_NETWORK_TYPE,
  TORUS_NETWORK_TYPE,
  TORUS_SAPPHIRE_NETWORK,
  TORUS_SAPPHIRE_NETWORK_TYPE,
  WEB3AUTH_KEY_TYPE,
  WEB3AUTH_SIG_TYPE,
} from "@toruslabs/constants";

import { getSapphireNodeDetails } from "./sapphireNetworkConfig";

export function validateKeyTypeAndSigTypeForTSS(keyType: WEB3AUTH_KEY_TYPE, sigType: WEB3AUTH_SIG_TYPE) {
  if (sigType === SIG_TYPE.ECDSA_SECP256K1) {
    if (keyType !== KEY_TYPE.SECP256K1) {
      throw new Error("Invalid key type for ecdsa-secp256k1");
    }
  } else if (sigType === SIG_TYPE.BIP340) {
    if (keyType !== KEY_TYPE.SECP256K1) {
      throw new Error("Invalid key type for bip340");
    }
  } else if (sigType === SIG_TYPE.ED25519) {
    if (keyType !== KEY_TYPE.ED25519) {
      throw new Error("Invalid key type for ed25519");
    }
  } else {
    throw new Error(`Invalid signature type, ${sigType}`);
  }
}

export function fetchLocalConfig(network: TORUS_NETWORK_TYPE, keyType: WEB3AUTH_KEY_TYPE, sigType?: WEB3AUTH_SIG_TYPE): INodeDetails | undefined {
  if (Object.values(TORUS_SAPPHIRE_NETWORK).includes(network as TORUS_SAPPHIRE_NETWORK_TYPE)) {
    return getSapphireNodeDetails(network as TORUS_SAPPHIRE_NETWORK_TYPE, undefined, keyType, sigType);
  }

  if (Object.values(TORUS_LEGACY_NETWORK).includes(network as TORUS_LEGACY_NETWORK_TYPE)) {
    const legacyMap = LEGACY_NETWORKS_ROUTE_MAP[network as TORUS_LEGACY_NETWORK_TYPE];
    if (legacyMap.migrationCompleted) return getSapphireNodeDetails(legacyMap.networkMigratedTo, network as TORUS_LEGACY_NETWORK_TYPE, keyType);
  }

  return undefined;
}
