import { LEGACY_NETWORKS_ROUTE_MAP, TORUS_LEGACY_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK, TORUS_SAPPHIRE_NETWORK_TYPE } from "@toruslabs/constants";

export const SAPPHIRE_NETWORK_URLS: Record<TORUS_SAPPHIRE_NETWORK_TYPE, string[]> = {
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET]: [
    "https://node-1.dev-node.web3auth.io",
    "https://node-2.dev-node.web3auth.io",
    "https://node-3.dev-node.web3auth.io",
    "https://node-4.dev-node.web3auth.io",
    "https://node-5.dev-node.web3auth.io",
  ],
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET]: [
    "https://sapphire-1.auth.network",
    "https://sapphire-2.auth.network",
    "https://sapphire-3.auth.network",
    "https://sapphire-4.auth.network",
    "https://sapphire-5.auth.network",
  ],
};

export const getSSSEndpoints = (sapphireNetwork: TORUS_SAPPHIRE_NETWORK_TYPE, legacyNetwork?: TORUS_LEGACY_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[sapphireNetwork];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${sapphireNetwork}`);
  }
  const routeIdentifier = LEGACY_NETWORKS_ROUTE_MAP[legacyNetwork as TORUS_LEGACY_NETWORK_TYPE];
  return endpoints.map((e) => {
    if (routeIdentifier && routeIdentifier.networkIdentifier) {
      return `${e}/sss/${routeIdentifier.networkIdentifier}/jrpc`;
    }
    return `${e}/sss/jrpc`;
  });
};

export const getRSSEndpoints = (sapphireNetwork: TORUS_SAPPHIRE_NETWORK_TYPE, legacyNetwork?: TORUS_LEGACY_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[sapphireNetwork];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${sapphireNetwork}`);
  }

  const routeIdentifier = LEGACY_NETWORKS_ROUTE_MAP[legacyNetwork as TORUS_LEGACY_NETWORK_TYPE];
  return endpoints.map((e) => {
    if (routeIdentifier && routeIdentifier.networkIdentifier) {
      return `${e}/rss/${routeIdentifier.networkIdentifier}`;
    }
    return `${e}/rss`;
  });
};

export const getTSSEndpoints = (sapphireNetwork: TORUS_SAPPHIRE_NETWORK_TYPE, legacyNetwork?: TORUS_LEGACY_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[sapphireNetwork];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${sapphireNetwork}`);
  }

  const routeIdentifier = LEGACY_NETWORKS_ROUTE_MAP[legacyNetwork as TORUS_LEGACY_NETWORK_TYPE];
  return endpoints.map((e) => {
    if (routeIdentifier && routeIdentifier.networkIdentifier) {
      return `${e}/tss/${routeIdentifier.networkIdentifier}`;
    }
    return `${e}/tss`;
  });
};
