import {
  KEY_TYPE,
  LEGACY_NETWORKS_ROUTE_MAP,
  SIG_TYPE,
  TORUS_LEGACY_NETWORK_TYPE,
  TORUS_SAPPHIRE_NETWORK,
  TORUS_SAPPHIRE_NETWORK_TYPE,
  WEB3AUTH_KEY_TYPE,
  WEB3AUTH_SIG_TYPE,
} from "@toruslabs/constants";

export const SAPPHIRE_NETWORK_URLS: Record<TORUS_SAPPHIRE_NETWORK_TYPE, string[]> = {
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET]: [
    "https://node-1.dev-node.web3auth.io",
    "https://node-2.dev-node.web3auth.io",
    "https://node-3.dev-node.web3auth.io",
    "https://node-4.dev-node.web3auth.io",
    "https://node-5.dev-node.web3auth.io",
  ],
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET]: [
    "https://node-1.node.web3auth.io",
    "https://node-2.node.web3auth.io",
    "https://node-3.node.web3auth.io",
    "https://node-4.node.web3auth.io",
    "https://node-5.node.web3auth.io",
  ],
};

export const getSSSEndpoints = (sapphireNetwork: TORUS_SAPPHIRE_NETWORK_TYPE, legacyNetwork?: TORUS_LEGACY_NETWORK_TYPE, trackingId?: string) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[sapphireNetwork];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${sapphireNetwork}`);
  }
  const routeIdentifier = LEGACY_NETWORKS_ROUTE_MAP[legacyNetwork as TORUS_LEGACY_NETWORK_TYPE];
  return endpoints.map((e) => {
    let endpoint = new URL(`${e}/sss/jrpc`);
    if (routeIdentifier && routeIdentifier.networkIdentifier) {
      endpoint = new URL(`${e}/sss/${routeIdentifier.networkIdentifier}/jrpc`);
    }
    if (trackingId) {
      endpoint.searchParams.set("trackingId", trackingId);
    }
    return endpoint.href;
  });
};

export const getRSSEndpoints = (sapphireNetwork: TORUS_SAPPHIRE_NETWORK_TYPE, trackingId?: string) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[sapphireNetwork];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${sapphireNetwork}`);
  }
  return endpoints.map((e) => {
    const endpoint = new URL(`${e}/rss`);

    if (trackingId) {
      endpoint.searchParams.set("trackingId", trackingId);
    }
    return endpoint.href;
  });
};

export const getTSSEndpoints = (
  sapphireNetwork: TORUS_SAPPHIRE_NETWORK_TYPE,
  keyType = KEY_TYPE.SECP256K1 as WEB3AUTH_KEY_TYPE,
  sigType?: WEB3AUTH_SIG_TYPE,
  trackingId?: string
) => {
  const endpoints = SAPPHIRE_NETWORK_URLS[sapphireNetwork];
  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported network: ${sapphireNetwork}`);
  }

  const tssPath = (() => {
    const dklsPath = "tss";
    const frostPath = "tss-frost";
    if (sigType) {
      if (sigType === SIG_TYPE.ECDSA_SECP256K1) {
        if (keyType !== KEY_TYPE.SECP256K1) {
          throw new Error("Invalid key type for ecdsa-secp256k1");
        }
        return dklsPath;
      } else if (sigType === SIG_TYPE.ED25519) {
        if (keyType !== KEY_TYPE.ED25519) {
          throw new Error("Invalid key type for ed25519");
        }
        return frostPath;
      } else if (sigType === SIG_TYPE.BIP340) {
        if (keyType !== KEY_TYPE.SECP256K1) {
          throw new Error("Invalid key type for bip340");
        }
        return frostPath;
      }
      throw new Error("Invalid sig type");
    } else if (keyType === KEY_TYPE.SECP256K1) {
      return dklsPath;
    } else if (keyType === KEY_TYPE.ED25519) {
      return frostPath;
    }
    throw new Error("Invalid key type");
  })();

  return endpoints.map((e) => {
    const endpoint = new URL(`${e}/${tssPath}`);
    if (trackingId) {
      endpoint.searchParams.set("trackingId", trackingId);
    }
    return endpoint.href;
  });
};
