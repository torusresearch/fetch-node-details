import type { TORUS_LEGACY_NETWORK_TYPE } from "./interfaces";

export const TORUS_LEGACY_NETWORK = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
  CYAN: "cyan",
  AQUA: "aqua",
  CELESTE: "celeste",
} as const;

export const LEGACY_MAINNET = "legacy_mainnet";
export const LEGACY_TESTNET = "legacy_testnet";
export const LEGACY_CYAN = "legacy_cyan";
export const LEGACY_AQUA = "legacy_aqua";
export const LEGACY_CELESTE = "legacy_celeste";
export const SAPPHIRE_DEVNET = "sapphire_devnet";
export const SAPPHIRE_TESTNET = "sapphire_testnet";
export const SAPPHIRE_MAINNET = "sapphire_mainnet";

export const TORUS_LEGACY_NETWORK_SAPPHIRE_ALIAS = {
  [LEGACY_MAINNET]: "legacy_mainnet",
  [LEGACY_TESTNET]: "legacy_testnet",
  [LEGACY_CYAN]: "legacy_cyan",
  [LEGACY_AQUA]: "legacy_aqua",
  [LEGACY_CELESTE]: "legacy_celeste",
} as const;

export const TORUS_SAPPHIRE_NETWORK = {
  [SAPPHIRE_DEVNET]: "sapphire_devnet",
  [SAPPHIRE_TESTNET]: "sapphire_testnet",
  [SAPPHIRE_MAINNET]: "sapphire_mainnet",
  ...TORUS_LEGACY_NETWORK_SAPPHIRE_ALIAS,
} as const;

export const TORUS_NETWORK = {
  ...TORUS_SAPPHIRE_NETWORK,
} as const;

export const PROXY_CONTRACT_ADDRESS = {
  [TORUS_LEGACY_NETWORK.MAINNET]: "0xf20336e16B5182637f09821c27BDe29b0AFcfe80",

  [TORUS_LEGACY_NETWORK.TESTNET]: "0xd084604e5FA387FbC2Da8bAab07fDD6aDED4614A",

  [TORUS_LEGACY_NETWORK.CYAN]: "0x9f072ba19b3370e512aa1b4bfcdaf97283168005",

  [TORUS_LEGACY_NETWORK.AQUA]: "0x29Dea82a0509153b91040ee13cDBba0f03efb625",

  [TORUS_LEGACY_NETWORK.CELESTE]: "0x6Bffb4e89453069E7487f0fa5c9f4a2D771cce6c",
};

export const MULTI_CLUSTER_NETWORKS: TORUS_LEGACY_NETWORK_TYPE[] = [
  TORUS_LEGACY_NETWORK.AQUA,
  TORUS_LEGACY_NETWORK.CELESTE,
  TORUS_LEGACY_NETWORK.CYAN,
];

export const NETWORK_MAP = {
  [TORUS_LEGACY_NETWORK.MAINNET]: "mainnet",
  [TORUS_LEGACY_NETWORK.TESTNET]: "goerli",
  [TORUS_LEGACY_NETWORK.CYAN]: "polygon-mainnet",
  [TORUS_LEGACY_NETWORK.AQUA]: "polygon-mainnet",
  [TORUS_LEGACY_NETWORK.CELESTE]: "polygon-mainnet",
};

export const SIGNER_MAP = {
  [TORUS_LEGACY_NETWORK.MAINNET]: "https://signer.tor.us",
  [TORUS_LEGACY_NETWORK.TESTNET]: "https://signer.tor.us",
  [TORUS_LEGACY_NETWORK.CYAN]: "https://signer-polygon.tor.us",
  [TORUS_LEGACY_NETWORK.AQUA]: "https://signer-polygon.tor.us",
  [TORUS_LEGACY_NETWORK.CELESTE]: "https://signer-polygon.tor.us",
};
