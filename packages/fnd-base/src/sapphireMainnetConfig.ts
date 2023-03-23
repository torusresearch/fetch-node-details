import { TORUS_SAPPHIRE_NETWORK } from "./constants";
import { getRSSEndpoints, getSSSEndpoints, getTSSEndpoints, NETWORK_URLS } from "./endpoints";
import { INodeDetails } from "./interfaces";

export const NODE_DETAILS_SAPPHIRE_MAINNET: INodeDetails = {
  currentEpoch: "1",
  torusNodeEndpoints: NETWORK_URLS[TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET],

  torusNodeSSSEndpoints: getSSSEndpoints(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET),

  torusNodeRSSEndpoints: getRSSEndpoints(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET),

  torusNodeTSSEndpoints: getTSSEndpoints(TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET),
  torusIndexes: [1, 2, 3, 4, 5],

  torusNodePub: [
    {
      X: "b00e38a144591d28529a9e823876f8bb40bd1950d975d3046b33a063a28be91a",
      Y: "35b40356167bbda44a9f0a583be7ada771c4d715ce5e63da5b59b8d3f5f5a186",
    },
    {
      X: "4b41b0dec6fd3b7400cf79b70bda3e2867591befbb1ce92904a71e6cbc185191",
      Y: "7ada2a90a57f8c39dd4c23007dcdb85b23b03a651fee115c7cdd53872f59b47b",
    },
    {
      X: "2dba245d0c31791b298791560a77531e0a65c0bb8f6a3942d87ed3e35cdd1749",
      Y: "db0ec14143ba59c2a63365f73cb9b04e79abb7905e05d34b5065928a77fd1ef0",
    },
    {
      X: "22e3cae184a39aed60feb2fdc3a8b6ce56007229d9fb99b24f72ef8bd539b0c9",
      Y: "2d6a9acbfa73a38be0f4dc190818a60e1529eedf5beb6ebf71b9c463b9969edb",
    },
    {
      X: "dfc312eba53e8427c5bc59694d27428f92ee4781129130c0c4f2fa439df4cb82",
      Y: "3fe9a620cb40c292e29f4ef0913a0717c16a8c1526dbf57d16981ed8ebb7839b",
    },
  ],
};
