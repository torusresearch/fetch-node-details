import { INodeDetails, TORUS_LEGACY_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK_TYPE } from "@toruslabs/constants";

import { getRSSEndpoints, getSSSEndpoints, getTSSEndpoints } from "./endpoints";
import { SAPPHIRE_NODE_PUB_KEYS } from "./pubKeys";

export const getSapphireNodeDetails = (sapphireNetwork: TORUS_SAPPHIRE_NETWORK_TYPE, legacyNetwork?: TORUS_LEGACY_NETWORK_TYPE): INodeDetails => {
  return {
    currentEpoch: "1",

    torusNodeEndpoints: getSSSEndpoints(sapphireNetwork),

    torusNodeSSSEndpoints: getSSSEndpoints(sapphireNetwork),

    torusNodeRSSEndpoints: !legacyNetwork ? getRSSEndpoints(sapphireNetwork) : [],

    torusNodeTSSEndpoints: !legacyNetwork ? getTSSEndpoints(sapphireNetwork) : [],
    torusIndexes: [1, 2, 3, 4, 5],

    torusNodePub: SAPPHIRE_NODE_PUB_KEYS[sapphireNetwork],
  };
};
