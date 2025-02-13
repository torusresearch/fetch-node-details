import {
  INodeDetails,
  LEGACY_NETWORKS_ROUTE_MAP,
  TORUS_LEGACY_NETWORK,
  TORUS_LEGACY_NETWORK_TYPE,
  TORUS_NETWORK_TYPE,
  TORUS_SAPPHIRE_NETWORK,
  TORUS_SAPPHIRE_NETWORK_TYPE,
  WEB3AUTH_KEY_TYPE,
  WEB3AUTH_SIG_TYPE,
} from "@toruslabs/constants";

import { getSapphireNodeDetails } from "./sapphireNetworkConfig";

export function fetchLocalConfig(
  network: TORUS_NETWORK_TYPE,
  keyType: WEB3AUTH_KEY_TYPE,
  sigType?: WEB3AUTH_SIG_TYPE,
  trackingId?: string
): INodeDetails | undefined {
  if (Object.values(TORUS_SAPPHIRE_NETWORK).includes(network as TORUS_SAPPHIRE_NETWORK_TYPE)) {
    const eps = getSapphireNodeDetails(network as TORUS_SAPPHIRE_NETWORK_TYPE, undefined, keyType, sigType, trackingId);
    return eps;
  }

  if (Object.values(TORUS_LEGACY_NETWORK).includes(network as TORUS_LEGACY_NETWORK_TYPE)) {
    const legacyMap = LEGACY_NETWORKS_ROUTE_MAP[network as TORUS_LEGACY_NETWORK_TYPE];
    if (legacyMap.migrationCompleted) {
      const ep = getSapphireNodeDetails(legacyMap.networkMigratedTo, network as TORUS_LEGACY_NETWORK_TYPE, keyType, sigType, trackingId);
      return ep;
    }
  }

  return undefined;
}
