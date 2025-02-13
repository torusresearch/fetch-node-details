import { INodeDetails, TORUS_LEGACY_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK_TYPE, WEB3AUTH_KEY_TYPE, WEB3AUTH_SIG_TYPE } from "@toruslabs/constants";

import { getRSSEndpoints, getSSSEndpoints, getTSSEndpoints } from "./endpoints";
import { SAPPHIRE_NODE_PUB_KEYS } from "./pubKeys";

export const getSapphireNodeDetails = (
  sapphireNetwork: TORUS_SAPPHIRE_NETWORK_TYPE,
  legacyNetwork?: TORUS_LEGACY_NETWORK_TYPE,
  keyType?: WEB3AUTH_KEY_TYPE,
  sigType?: WEB3AUTH_SIG_TYPE,
  trackingId?: string
): INodeDetails => {
  return {
    currentEpoch: "1",

    torusNodeEndpoints: getSSSEndpoints(sapphireNetwork, legacyNetwork, trackingId),

    torusNodeSSSEndpoints: getSSSEndpoints(sapphireNetwork, legacyNetwork, trackingId),

    torusNodeRSSEndpoints: getRSSEndpoints(sapphireNetwork, trackingId),

    torusNodeTSSEndpoints: getTSSEndpoints(sapphireNetwork, keyType, sigType, trackingId),
    torusIndexes: [1, 2, 3, 4, 5],

    torusNodePub: SAPPHIRE_NODE_PUB_KEYS[sapphireNetwork],
  };
};
