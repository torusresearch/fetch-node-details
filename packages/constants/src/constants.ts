import type { ILegacyNetworkMigrationInfo, TORUS_LEGACY_NETWORK_TYPE, TORUS_NETWORK_TYPE } from "./interfaces";

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

export const PROXY_CONTRACT_ADDRESS = {
  [TORUS_LEGACY_NETWORK.MAINNET]: "0xf20336e16B5182637f09821c27BDe29b0AFcfe80",

  [TORUS_LEGACY_NETWORK.TESTNET]: "0xd084604e5FA387FbC2Da8bAab07fDD6aDED4614A",

  [TORUS_LEGACY_NETWORK.CYAN]: "0x9f072ba19b3370e512aa1b4bfcdaf97283168005",

  [TORUS_LEGACY_NETWORK.AQUA]: "0x29Dea82a0509153b91040ee13cDBba0f03efb625",

  [TORUS_LEGACY_NETWORK.CELESTE]: "0x6Bffb4e89453069E7487f0fa5c9f4a2D771cce6c",
};

export const MULTI_CLUSTER_NETWORKS: TORUS_LEGACY_NETWORK_TYPE[] = [
  // TORUS_LEGACY_NETWORK.AQUA,
  // TORUS_LEGACY_NETWORK.CELESTE,
  // TORUS_LEGACY_NETWORK.CYAN,
];

export const LEGACY_NETWORKS_ROUTE_MAP: Record<TORUS_LEGACY_NETWORK_TYPE, ILegacyNetworkMigrationInfo> = {
  [TORUS_LEGACY_NETWORK.AQUA]: { migrationCompleted: true, networkIdentifier: "aqua", networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET },
  [TORUS_LEGACY_NETWORK.CELESTE]: {
    migrationCompleted: true,
    networkIdentifier: "celeste",
    networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET,
  },
  [TORUS_LEGACY_NETWORK.CYAN]: { migrationCompleted: true, networkIdentifier: "cyan", networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET },
  [TORUS_LEGACY_NETWORK.MAINNET]: {
    migrationCompleted: true,
    networkIdentifier: "mainnet",
    networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET,
  },
  [TORUS_LEGACY_NETWORK.TESTNET]: {
    migrationCompleted: true,
    networkIdentifier: "teal",
    networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET,
  },
};

export const NETWORK_MAP: Record<TORUS_LEGACY_NETWORK_TYPE, string> = {
  [TORUS_LEGACY_NETWORK.MAINNET]: "mainnet",
  [TORUS_LEGACY_NETWORK.TESTNET]: "goerli",
  [TORUS_LEGACY_NETWORK.CYAN]: "polygon-mainnet",
  [TORUS_LEGACY_NETWORK.AQUA]: "polygon-mainnet",
  [TORUS_LEGACY_NETWORK.CELESTE]: "polygon-mainnet",
};

export const SIGNER_MAP: Record<TORUS_NETWORK_TYPE, string> = {
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET]: "https://api.web3auth.io/signer-service",
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET]: "https://api.web3auth.io/signer-service",
  [TORUS_LEGACY_NETWORK.MAINNET]: "https://api.web3auth.io/signer-service",
  [TORUS_LEGACY_NETWORK.TESTNET]: "https://api.web3auth.io/signer-service",
  [TORUS_LEGACY_NETWORK.CYAN]: "https://api.web3auth.io/signer-polygon-service",
  [TORUS_LEGACY_NETWORK.AQUA]: "https://api.web3auth.io/signer-polygon-service",
  [TORUS_LEGACY_NETWORK.CELESTE]: "https://api.web3auth.io/signer-polygon-service",
};

export const METADATA_MAP: Record<TORUS_LEGACY_NETWORK_TYPE, string> = {
  [TORUS_LEGACY_NETWORK.MAINNET]: "https://api.web3auth.io/metadata-service",
  [TORUS_LEGACY_NETWORK.TESTNET]: "https://api.web3auth.io/metadata-service",
  [TORUS_LEGACY_NETWORK.CYAN]: "https://api.web3auth.io/metadata-service",
  [TORUS_LEGACY_NETWORK.AQUA]: "https://api.web3auth.io/metadata-service",
  [TORUS_LEGACY_NETWORK.CELESTE]: "https://api.web3auth.io/metadata-service",
};

// FND backend service
export const FND_SERVER = "https://api.web3auth.io/fnd-service";

// Session backend service
export const SESSION_SERVER_API_URL = "https://api.web3auth.io/session-service";
export const SESSION_SERVER_SOCKET_URL = "https://session.web3auth.io";

// Passwordless backend service
export const PASSWORDLESS_SERVER_API_URL = "https://api.web3auth.io/passwordless-service";
export const PASSWORDLESS_SERVER_SOCKET_URL = "https://api-passwordless.web3auth.io";
export const DEVELOP_PASSWORDLESS_SERVER_API_URL = "https://develop-api.web3auth.io/passwordless-service";
export const DEVELOP_PASSWORDLESS_SERVER_SOCKET_URL = "https://api-develop-passwordless.web3auth.io";

// Auth backend service
export const AUTH_SERVER_URL = "https://api.web3auth.io/auth-service";
export const DEVELOP_AUTH_SERVER_URL = "https://develop-api.web3auth.io/auth-service";

// Wallet backend service
export const WALLET_SERVER_URL = "https://api.web3auth.io/wallet-service";
export const DEVELOP_WALLET_SERVER_URL = "https://develop-api.web3auth.io/wallet-service";

// Legacy Metadata backend service
export const LEGACY_METADATA_SERVER_URL = "https://api.web3auth.io/metadata-service";
export const DEVELOP_LEGACY_METADATA_SERVER_URL = "https://develop-api.web3auth.io/metadata-service";

// TKey Email Backend service
export const TKEY_EMAIL_SERVER_URL = "https://api.web3auth.io/tkey-email-service";

// Authjs backend service
export const AUTHJS_SERVER_URL = "https://api.web3auth.io/authjs-service";

export const KEY_TYPE = {
  SECP256K1: "secp256k1",
  ED25519: "ed25519",
} as const;
