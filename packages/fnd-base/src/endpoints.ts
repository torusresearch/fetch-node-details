import { TORUS_NETWORK, TORUS_SAPPHIRE_NETWORK_TYPE } from "@toruslabs/constants";

export const SAPPHIRE_NETWORK_URLS: Record<TORUS_SAPPHIRE_NETWORK_TYPE, string[]> = {
  [TORUS_NETWORK.SAPPHIRE_DEVNET]: [
    "https://sapphire-dev-2-1.authnetwork.dev",
    "https://sapphire-dev-2-2.authnetwork.dev",
    "https://sapphire-dev-2-3.authnetwork.dev",
    "https://sapphire-dev-2-4.authnetwork.dev",
    "https://sapphire-dev-2-5.authnetwork.dev",
  ],
  [TORUS_NETWORK.SAPPHIRE_TESTNET]: [
    "https://lrc1.authnetwork.dev",
    "https://lrc2.authnetwork.dev",
    "https://lrc3.authnetwork.dev",
    "https://lrc4.authnetwork.dev",
    "https://lrc5.authnetwork.dev",
  ],
  [TORUS_NETWORK.SAPPHIRE_MAINNET]: [
    "https://sapphire-1.auth.network",
    "https://sapphire-2.auth.network",
    "https://sapphire-3.auth.network",
    "https://sapphire-4.auth.network",
    "https://sapphire-5.auth.network",
  ],
};

export const getSSSEndpoints = (network: TORUS_SAPPHIRE_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return endpoints.map((e) => {
    return `${e}/sss/jrpc`;
  });
};

export const getRSSEndpoints = (network: TORUS_SAPPHIRE_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return endpoints.map((e) => {
    return `${e}/rss`;
  });
};

export const getTSSEndpoints = (network: TORUS_SAPPHIRE_NETWORK_TYPE) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[network];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return endpoints.map((e) => {
    return `${e}/tss`;
  });
};
