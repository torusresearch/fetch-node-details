import { INodeDetails, LEGACY_NETWORKS_ROUTE_MAP, TORUS_LEGACY_NETWORK, TORUS_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK } from "@toruslabs/constants";

import { NODE_DETAILS_MAINNET } from "./legacyMainnetConfig";
import { NODE_DETAILS_SAPPHIRE_DEVNET } from "./sapphireDevnetConfig";
import { NODE_DETAILS_SAPPHIRE_LEGACY_TESTNET, NODE_DETAILS_SAPPHIRE_TESTNET } from "./sapphireLrcConfig";
import { NODE_DETAILS_SAPPHIRE_MAINNET } from "./sapphireMainnetConfig";

export function fetchLocalConfig(network: TORUS_NETWORK_TYPE): INodeDetails | undefined {
  if (network === TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET) {
    return NODE_DETAILS_SAPPHIRE_DEVNET;
  }
  if (network === TORUS_SAPPHIRE_NETWORK.SAPPHIRE_TESTNET) {
    return NODE_DETAILS_SAPPHIRE_TESTNET;
  }
  if (network === TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET) {
    return NODE_DETAILS_SAPPHIRE_MAINNET;
  }
  const legacyMap = LEGACY_NETWORKS_ROUTE_MAP[network];

  if (legacyMap.migrationCompleted) {
    return NODE_DETAILS_SAPPHIRE_LEGACY_TESTNET;
  }
  if (network === TORUS_LEGACY_NETWORK.TESTNET) {
    return NODE_DETAILS_SAPPHIRE_LEGACY_TESTNET;
  }
  if (network === TORUS_LEGACY_NETWORK.MAINNET) {
    return NODE_DETAILS_MAINNET;
  }
  return undefined;
}
