import {
  MULTI_CLUSTER_NETWORKS,
  PROXY_CONTRACT_ADDRESS,
  TORUS_LEGACY_NETWORK,
  TORUS_LEGACY_NETWORK_TYPE,
  TORUS_NETWORK_TYPE,
  TORUS_SAPPHIRE_NETWORK,
} from "@toruslabs/constants";
import { fetchLocalConfig } from "@toruslabs/fnd-base";
import { celebrate, Joi } from "celebrate";
import express, { Request, Response } from "express";
import log from "loglevel";

import redisClient from "./database/redis";
import { getLegacyNodeDetails } from "./utils/helpers";

const router = express.Router();

const NODE_INFO_EXPIRY = 24 * 60 * 60; // 1 day

const getNetworkRedisKey = (network: TORUS_NETWORK_TYPE, verifier: string, verifierId: string) => {
  if (!MULTI_CLUSTER_NETWORKS.includes(network as TORUS_LEGACY_NETWORK_TYPE)) return `fnd:${network}`;
  return `fnd:${network}:${verifier}:${verifierId}`;
};

router.get("/", (_req: Request, res: Response) => {
  return res.status(200).send("Welcome to the fnd server!!");
});

router.get("/health", (_req: Request, res: Response) => {
  return res.status(200).send("ok!");
});

router.get(
  "/node-details",
  celebrate(
    {
      query: Joi.object({
        network: Joi.string()
          .required()
          .allow(...Object.values(TORUS_LEGACY_NETWORK), ...Object.values(TORUS_SAPPHIRE_NETWORK)),
        verifier: Joi.string().required(),
        verifierId: Joi.string().required(),
      }),
    },
    { allowUnknown: true }
  ),
  async (req: Request, res: Response) => {
    try {
      const { network, verifier, verifierId } = req.query as Record<string, string>;
      const cacheKey = getNetworkRedisKey(network as TORUS_NETWORK_TYPE, verifier, verifierId);

      let nodeDetails = fetchLocalConfig(network as TORUS_NETWORK_TYPE);
      if (nodeDetails) {
        return res.status(200).json({
          nodeDetails,
          success: true,
        });
      }
      // use static details for mainnet and testnet
      try {
        const cachedInfo = await redisClient.get(cacheKey);
        if (cachedInfo) {
          nodeDetails = JSON.parse(cachedInfo || "{}");
          if (Object.keys(nodeDetails).length > 0) {
            return res.status(200).json({
              nodeDetails,
              success: true,
            });
          }
          log.warn("Found empty node list from cache");
        }

        nodeDetails = await getLegacyNodeDetails({
          verifier,
          verifierId,
          network,
          proxyAddress: PROXY_CONTRACT_ADDRESS[network],
        });

        redisClient.setEx(cacheKey, NODE_INFO_EXPIRY, JSON.stringify(nodeDetails));
      } catch (error) {
        log.warn("Error while setting cached nodes info ", network, error);
      }
      return res.status(200).json({
        nodeDetails,
        success: true,
      });
    } catch (error) {
      log.error("Error while fetching nodes details", error);
      return res.status(500).json({
        success: false,
        message: (error as Error).message || "Something went wrong",
      });
    }
  }
);

router.get("/invalidate-cache", async (req: Request, res: Response) => {
  try {
    const { network, verifier, verifierId } = req.query as Record<string, string>;
    const cacheKey = getNetworkRedisKey(network as TORUS_NETWORK_TYPE, verifier, verifierId);
    await redisClient.setEx(cacheKey, 1, "{}");

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    log.error("Error while invalidating cached nodes details", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Something went wrong",
    });
  }
});

export default router;
