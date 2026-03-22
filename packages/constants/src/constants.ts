import type { BUILD_ENV_TYPE, ILegacyNetworkMigrationInfo, TORUS_LEGACY_NETWORK_TYPE } from "./interfaces";

export const TORUS_LEGACY_NETWORK = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
  CYAN: "cyan",
  AQUA: "aqua",
  CELESTE: "celeste",
} as const;

export const TORUS_SAPPHIRE_NETWORK = {
  SAPPHIRE_DEVNET: "sapphire_devnet",
  SAPPHIRE_MAINNET: "sapphire_mainnet",
} as const;

export const BUILD_ENV = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  STAGING: "staging",
  TESTING: "testing",
} as const;

export const LEGACY_NETWORKS_ROUTE_MAP: Record<TORUS_LEGACY_NETWORK_TYPE, ILegacyNetworkMigrationInfo> = {
  [TORUS_LEGACY_NETWORK.AQUA]: { networkIdentifier: "aqua", networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET },
  [TORUS_LEGACY_NETWORK.CELESTE]: {
    networkIdentifier: "celeste",
    networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET,
  },
  [TORUS_LEGACY_NETWORK.CYAN]: { networkIdentifier: "cyan", networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET },
  [TORUS_LEGACY_NETWORK.MAINNET]: {
    networkIdentifier: "mainnet",
    networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET,
  },
  [TORUS_LEGACY_NETWORK.TESTNET]: {
    networkIdentifier: "teal",
    networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET,
  },
};

export const CITADEL_SERVER_MAP: Record<BUILD_ENV_TYPE, string> = {
  [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/citadel-service",
  [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/citadel-service",
  [BUILD_ENV.STAGING]: "https://api.web3auth.io/citadel-service",
  [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/citadel-service",
};

export const DASHBOARD_PUBLIC_API_MAP: Record<BUILD_ENV_TYPE, string> = {
  [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/signer-service",
  [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/signer-service",
  [BUILD_ENV.STAGING]: "https://api.web3auth.io/signer-service",
  [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/signer-service",
};

export const LEGACY_METADATA_MAP: Record<BUILD_ENV_TYPE, string> = {
  [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/metadata-service",
  [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/metadata-service",
  [BUILD_ENV.STAGING]: "https://api.web3auth.io/metadata-service",
  [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/metadata-service",
};

// FND backend service
export const FND_SERVER_MAP: Record<BUILD_ENV_TYPE, string> = {
  [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/fnd-service",
  [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/fnd-service",
  [BUILD_ENV.STAGING]: "https://api.web3auth.io/fnd-service",
  [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/fnd-service",
};

// Storage backend service
export const STORAGE_SERVER_MAP: Record<BUILD_ENV_TYPE, string> = {
  [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/session-service",
  [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/session-service",
  [BUILD_ENV.STAGING]: "https://api.web3auth.io/session-service",
  [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/session-service",
};

export const STORAGE_SERVER_SOCKET_URL_MAP: Record<BUILD_ENV_TYPE, string> = {
  [BUILD_ENV.PRODUCTION]: "https://session.web3auth.io",
  [BUILD_ENV.DEVELOPMENT]: "https://develop-session.web3auth.io",
  [BUILD_ENV.STAGING]: "https://session.web3auth.io",
  [BUILD_ENV.TESTING]: "https://develop-session.web3auth.io",
};

export const KEY_TYPE = {
  SECP256K1: "secp256k1",
  ED25519: "ed25519",
} as const;

export const SIG_TYPE = {
  ECDSA_SECP256K1: "ecdsa-secp256k1",
  ED25519: "ed25519",
  BIP340: "bip340",
} as const;
