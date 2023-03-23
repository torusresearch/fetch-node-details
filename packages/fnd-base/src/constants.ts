export const TORUS_SAPPHIRE_NETWORK = {
  SAPPHIRE_DEVNET: "sapphire_devnet",
  SAPPHIRE_TESTNET: "sapphire_testnet",
  SAPPHIRE_MAINNET: "sapphire_mainnet",
} as const;
export const TORUS_NETWORK = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
  CYAN: "cyan",
  AQUA: "aqua",
  CELESTE: "celeste",
  ...TORUS_SAPPHIRE_NETWORK,
} as const;

export const PROXY_CONTRACT_ADDRESS = {
  [TORUS_NETWORK.MAINNET]: "0xf20336e16B5182637f09821c27BDe29b0AFcfe80",

  [TORUS_NETWORK.TESTNET]: "0xd084604e5FA387FbC2Da8bAab07fDD6aDED4614A",

  [TORUS_NETWORK.CYAN]: "0x9f072ba19b3370e512aa1b4bfcdaf97283168005",

  [TORUS_NETWORK.AQUA]: "0x29Dea82a0509153b91040ee13cDBba0f03efb625",

  [TORUS_NETWORK.CELESTE]: "0x6Bffb4e89453069E7487f0fa5c9f4a2D771cce6c",
};
export const MULTI_CLUSTER_NETWORKS = [TORUS_NETWORK.AQUA, TORUS_NETWORK.CELESTE, TORUS_NETWORK.CYAN];
