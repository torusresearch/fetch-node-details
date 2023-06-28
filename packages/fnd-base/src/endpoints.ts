import {
  LEGACY_NETWORKS_ROUTE_MAP,
  TORUS_LEGACY_NETWORK_TYPE,
  TORUS_NETWORK_TYPE,
  TORUS_SAPPHIRE_NETWORK,
  TORUS_SAPPHIRE_NETWORK_TYPE,
} from "@toruslabs/constants";

export const SAPPHIRE_NETWORK_URLS: Record<TORUS_SAPPHIRE_NETWORK_TYPE, string[]> = {
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET]: [
    "https://sapphire-dev-2-1.authnetwork.dev",
    "https://sapphire-dev-2-2.authnetwork.dev",
    "https://sapphire-dev-2-3.authnetwork.dev",
    "https://sapphire-dev-2-4.authnetwork.dev",
    "https://sapphire-dev-2-5.authnetwork.dev",
  ],
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_TESTNET]: [
    "https://sapphire-dev-2-1.authnetwork.dev",
    "https://sapphire-dev-2-2.authnetwork.dev",
    "https://sapphire-dev-2-3.authnetwork.dev",
    "https://sapphire-dev-2-4.authnetwork.dev",
    "https://sapphire-dev-2-5.authnetwork.dev",
  ],
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET]: [
    "https://sapphire-1.auth.network",
    "https://sapphire-2.auth.network",
    "https://sapphire-3.auth.network",
    "https://sapphire-4.auth.network",
    "https://sapphire-5.auth.network",
  ],
};

export const getSSSEndpoints = (network: TORUS_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network as TORUS_SAPPHIRE_NETWORK_TYPE];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }
  const routeIdentifier = LEGACY_NETWORKS_ROUTE_MAP[network as TORUS_LEGACY_NETWORK_TYPE];
  return endpoints.map((e) => {
    if (routeIdentifier && routeIdentifier.networkIdentifier) {
      return `${e}/sss/${routeIdentifier.networkIdentifier}/jrpc`;
    }
    return `${e}/sss/jrpc`;
  });
};

export const getRSSEndpoints = (network: TORUS_SAPPHIRE_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const routeIdentifier = LEGACY_NETWORKS_ROUTE_MAP[network as TORUS_LEGACY_NETWORK_TYPE];
  return endpoints.map((e) => {
    if (routeIdentifier && routeIdentifier.networkIdentifier) {
      return `${e}/rss/${routeIdentifier.networkIdentifier}`;
    }
    return `${e}/rss`;
  });
};

export const getTSSEndpoints = (network: TORUS_SAPPHIRE_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const routeIdentifier = LEGACY_NETWORKS_ROUTE_MAP[network as TORUS_LEGACY_NETWORK_TYPE];
  return endpoints.map((e) => {
    if (routeIdentifier && routeIdentifier.networkIdentifier) {
      return `${e}/tss/${routeIdentifier.networkIdentifier}`;
    }
    return `${e}/tss`;
  });
};
