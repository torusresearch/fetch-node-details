import type { ILegacyNetworkMigrationInfo, TORUS_LEGACY_NETWORK_TYPE, TORUS_NETWORK_TYPE } from "./interfaces";

export const TORUS_LEGACY_NETWORK = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
  CYAN: "cyan",
  AQUA: "aqua",
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
};

export const MULTI_CLUSTER_NETWORKS: TORUS_LEGACY_NETWORK_TYPE[] = [
  // TORUS_LEGACY_NETWORK.AQUA,
  // TORUS_LEGACY_NETWORK.CYAN,
];

export const LEGACY_NETWORKS_ROUTE_MAP: Record<TORUS_LEGACY_NETWORK_TYPE, ILegacyNetworkMigrationInfo> = {
  [TORUS_LEGACY_NETWORK.AQUA]: { migrationCompleted: true, networkIdentifier: "aqua", networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET },
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
};

export const SIGNER_MAP: Record<TORUS_NETWORK_TYPE, string> = {
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET]: "https://api.web3auth.io/signer-service",
  [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET]: "https://api.web3auth.io/signer-service",
  [TORUS_LEGACY_NETWORK.MAINNET]: "https://api.web3auth.io/signer-service",
  [TORUS_LEGACY_NETWORK.TESTNET]: "https://api.web3auth.io/signer-service",
  [TORUS_LEGACY_NETWORK.CYAN]: "https://api.web3auth.io/signer-polygon-service",
  [TORUS_LEGACY_NETWORK.AQUA]: "https://api.web3auth.io/signer-polygon-service",
};

export const METADATA_MAP: Record<TORUS_LEGACY_NETWORK_TYPE, string> = {
  [TORUS_LEGACY_NETWORK.MAINNET]: "https://api.web3auth.io/metadata-service",
  [TORUS_LEGACY_NETWORK.TESTNET]: "https://api.web3auth.io/metadata-service",
  [TORUS_LEGACY_NETWORK.CYAN]: "https://api.web3auth.io/metadata-service",
  [TORUS_LEGACY_NETWORK.AQUA]: "https://api.web3auth.io/metadata-service",
};

// FND backend service
export const FND_SERVER = "https://api.web3auth.io/fnd-service";

// Session backend service
export const SESSION_SERVER_API_URL = "https://api.web3auth.io/session-service";
export const SESSION_SERVER_SOCKET_URL = "https://session.web3auth.io";

// Authjs backend service
export const AUTHJS_SERVER_URL = "https://api.web3auth.io/authjs-service";

export const KEY_TYPE = {
  SECP256K1: "secp256k1",
  ED25519: "ed25519",
} as const;

export const SIG_TYPE = {
  ECDSA_SECP256K1: "ecdsa-secp256k1",
  ED25519: "ed25519",
  BIP340: "bip340",
} as const;

export const TEST_VERIFIERS = ["torus-test-health"];
