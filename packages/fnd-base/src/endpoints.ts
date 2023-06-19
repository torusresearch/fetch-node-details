import { LEGACY_NETWORKS_ROUTE_MAP, TORUS_LEGACY_NETWORK_TYPE, TORUS_NETWORK, TORUS_NETWORK_TYPE } from "@toruslabs/constants";

export const SAPPHIRE_NETWORK_URLS: Record<TORUS_NETWORK_TYPE, string[]> = {
  [TORUS_NETWORK.SAPPHIRE_DEVNET]: [
    "https://sapphire-dev-2-1.authnetwork.dev",
    "https://sapphire-dev-2-2.authnetwork.dev",
    "https://sapphire-dev-2-3.authnetwork.dev",
    "https://sapphire-dev-2-4.authnetwork.dev",
    "https://sapphire-dev-2-5.authnetwork.dev",
  ],
  [TORUS_NETWORK.SAPPHIRE_TESTNET]: [
    "https://sapphire-dev-2-1.authnetwork.dev",
    "https://sapphire-dev-2-2.authnetwork.dev",
    "https://sapphire-dev-2-3.authnetwork.dev",
    "https://sapphire-dev-2-4.authnetwork.dev",
    "https://sapphire-dev-2-5.authnetwork.dev",
  ],
  [TORUS_NETWORK.SAPPHIRE_MAINNET]: [
    "https://sapphire-1.auth.network",
    "https://sapphire-2.auth.network",
    "https://sapphire-3.auth.network",
    "https://sapphire-4.auth.network",
    "https://sapphire-5.auth.network",
  ],
  [TORUS_NETWORK.LEGACY_TESTNET]: [
    "https://sapphire-dev-2-1.authnetwork.dev",
    "https://sapphire-dev-2-2.authnetwork.dev",
    "https://sapphire-dev-2-3.authnetwork.dev",
    "https://sapphire-dev-2-4.authnetwork.dev",
    "https://sapphire-dev-2-5.authnetwork.dev",
  ],
  [TORUS_NETWORK.LEGACY_MAINNET]: [
    "https://sapphire-1.auth.network",
    "https://sapphire-2.auth.network",
    "https://sapphire-3.auth.network",
    "https://sapphire-4.auth.network",
    "https://sapphire-5.auth.network",
  ],
  [TORUS_NETWORK.LEGACY_CYAN]: [
    "https://sapphire-1.auth.network",
    "https://sapphire-2.auth.network",
    "https://sapphire-3.auth.network",
    "https://sapphire-4.auth.network",
    "https://sapphire-5.auth.network",
  ],
  [TORUS_NETWORK.LEGACY_CELESTE]: [
    "https://sapphire-1.auth.network",
    "https://sapphire-2.auth.network",
    "https://sapphire-3.auth.network",
    "https://sapphire-4.auth.network",
    "https://sapphire-5.auth.network",
  ],
  [TORUS_NETWORK.LEGACY_AQUA]: [
    "https://sapphire-1.auth.network",
    "https://sapphire-2.auth.network",
    "https://sapphire-3.auth.network",
    "https://sapphire-4.auth.network",
    "https://sapphire-5.auth.network",
  ],
};

export const getSSSEndpoints = (network: TORUS_NETWORK_TYPE | TORUS_LEGACY_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }
  const routeIdentifier = LEGACY_NETWORKS_ROUTE_MAP[network as TORUS_LEGACY_NETWORK_TYPE];
  return endpoints.map((e) => {
    if (routeIdentifier) {
      return `${e}/sss/${routeIdentifier}/jrpc`;
    }
    return `${e}/sss/jrpc`;
  });
};

export const getRSSEndpoints = (network: TORUS_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return endpoints.map((e) => {
    return `${e}/rss`;
  });
};

export const getTSSEndpoints = (network: TORUS_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return endpoints.map((e) => {
    return `${e}/tss`;
  });
};
