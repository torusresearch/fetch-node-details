import { TORUS_NETWORK_TYPE, WEB3AUTH_KEY_TYPE } from "@toruslabs/constants";

export type NodeDetailManagerParams = {
  network?: TORUS_NETWORK_TYPE;
  keyType?: WEB3AUTH_KEY_TYPE;
  fndServerEndpoint?: string;
  enableLogging?: boolean;
};
