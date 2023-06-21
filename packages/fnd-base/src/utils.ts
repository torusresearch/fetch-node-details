import { INodeDetails, TORUS_NETWORK, TORUS_NETWORK_TYPE } from "@toruslabs/constants";

import { NODE_DETAILS_MAINNET } from "./legacyMainnetConfig";
import { NODE_DETAILS_SAPPHIRE_DEVNET } from "./sapphireDevnetConfig";
import { NODE_DETAILS_SAPPHIRE_LEGACY_TESTNET, NODE_DETAILS_SAPPHIRE_TESTNET } from "./sapphireLrcConfig";
import { NODE_DETAILS_SAPPHIRE_MAINNET } from "./sapphireMainnetConfig";

export function fetchLocalConfig(network: TORUS_NETWORK_TYPE): INodeDetails | undefined {
  if (network === TORUS_NETWORK.SAPPHIRE_DEVNET) {
    return NODE_DETAILS_SAPPHIRE_DEVNET;
  } else if (network === TORUS_NETWORK.SAPPHIRE_TESTNET) {
    return NODE_DETAILS_SAPPHIRE_TESTNET;
  } else if (network === TORUS_NETWORK.SAPPHIRE_MAINNET) {
    return NODE_DETAILS_SAPPHIRE_MAINNET;
  } else if (network === TORUS_NETWORK.LEGACY_TESTNET) {
    return NODE_DETAILS_SAPPHIRE_LEGACY_TESTNET;
  } else if (network === TORUS_NETWORK.LEGACY_MAINNET) {
    return NODE_DETAILS_MAINNET; // TODO: point mainnet, cyan, celeste and aqua to sapphire routes, once migrated.
  }
  return undefined;
}
