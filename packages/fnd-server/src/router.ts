import {
  INodeDetails,
  INodePub,
  JRPCResponse,
  MULTI_CLUSTER_NETWORKS,
  NODE,
  NodeLookupResponse,
  PROXY_CONTRACT_ADDRESS,
  TORUS_LEGACY_NETWORK,
  TORUS_LEGACY_NETWORK_TYPE,
  TORUS_NETWORK,
  TORUS_NETWORK_TYPE,
} from "@toruslabs/constants";
import { fetchLocalConfig, SAPPHIRE_NETWORK_URLS } from "@toruslabs/fnd-base";
import { generateJsonRPCObject, post } from "@toruslabs/http-helpers";
import { celebrate, Joi } from "celebrate";
import express, { Request, Response } from "express";
import log from "loglevel";

import redisClient from "./database/redis";
import { getLegacyNodeDetails, thresholdSame } from "./utils/helpers";

const router = express.Router();

const NODE_INFO_EXPIRY = 24 * 60 * 60; // 1 day

const getNetworkRedisKey = (network: TORUS_NETWORK_TYPE | TORUS_LEGACY_NETWORK_TYPE, verifier: string, verifierId: string) => {
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
          .allow(...Object.values(TORUS_NETWORK)),
        verifier: Joi.string().required(),
        verifierId: Joi.string().required(),
      }),
    },
    { allowUnknown: true }
  ),
  async (req: Request, res: Response) => {
    try {
      const { network, verifier, verifierId } = req.query as Record<string, string>;
      const cacheKey = getNetworkRedisKey(network as TORUS_LEGACY_NETWORK_TYPE, verifier, verifierId);

      try {
        const cachedInfo = await redisClient.get(cacheKey);
        if (cachedInfo) {
          const nodeDetails = JSON.parse(cachedInfo || "{}");
          if (Object.keys(nodeDetails).length > 0) {
            return res.status(200).json({
              nodeDetails,
              success: true,
            });
          }
          log.warn("Found empty node list from cache");
        }
      } catch (error) {
        log.warn("Error while getting cached nodes info", error);
      }

      // if not a sapphire network
      if (Object.values(TORUS_LEGACY_NETWORK).includes(network as TORUS_LEGACY_NETWORK_TYPE)) {
        let nodeDetails = fetchLocalConfig(network as TORUS_LEGACY_NETWORK_TYPE);
        // use static details for mainnet and testnet
        if (!nodeDetails) {
          nodeDetails = await getLegacyNodeDetails({
            verifier,
            verifierId,
            network,
            proxyAddress: PROXY_CONTRACT_ADDRESS[network],
          });
        }
        try {
          redisClient.setEx(cacheKey, NODE_INFO_EXPIRY, JSON.stringify(nodeDetails));
        } catch (error) {
          log.warn("Error while setting cached nodes info", error);
        }
        return res.status(200).json({
          nodeDetails,
          success: true,
        });
      }
      const endPoints: string[] = SAPPHIRE_NETWORK_URLS[network as TORUS_NETWORK_TYPE];
      if (!endPoints || endPoints.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Unsupported network: ${network}`,
        });
      }

      const lookupPromises = endPoints.map((x: string) =>
        post<JRPCResponse<NodeLookupResponse>>(`${x}/sss/jrpc`, generateJsonRPCObject("NodeDetailsRequest", {})).catch((err) =>
          log.error("node lookup request failed", err)
        )
      );

      const lookupResponses = await Promise.all(lookupPromises);

      const errorResult = thresholdSame(
        lookupResponses.map((x2: void | JRPCResponse<unknown>) => x2 && x2.error),
        ~~(endPoints.length / 2) + 1
      );
      const thresholdNodes = thresholdSame<{
        nodes: (NODE | undefined)[];
      } | void>(
        lookupResponses.map((x3) => x3 && x3.result),
        ~~(endPoints.length / 2) + 1
      );

      if (!thresholdNodes && !errorResult) {
        throw new Error(`invalid results ${JSON.stringify(lookupResponses)}`);
      }

      if (errorResult) {
        throw new Error(`node lookup results do not match, ${JSON.stringify(errorResult || {})}`);
      }

      if (!thresholdNodes) {
        throw new Error("Unable to reach threshold for node lookups");
      }

      const parsedNodes = thresholdNodes.nodes;

      if (parsedNodes.length !== endPoints.length) {
        throw new Error(`Unable to fetch info for required nodes, required: ${endPoints.length}, found: ${parsedNodes.length}`);
      }
      const updatedBaseEndpoints: string[] = [];
      const updatedSSSEndpoints: string[] = [];
      const updatedRSSEndpoints: string[] = [];
      const updatedTSSEndpoints: string[] = [];
      const updatedNodePub: INodePub[] = [];
      const indexes: number[] = [];
      let epoch = "1";
      // nodes returns node list in sorted order of node indexes
      // currently node indexes are sorted in the order of endpoints.
      // so looping over endpoints is fine.
      for (let index = 0; index < endPoints.length; index++) {
        const nodeInfo = parsedNodes[index];
        if (!nodeInfo) {
          throw new Error("Invalid/empty node info found in nodes details");
        }
        if (nodeInfo.epoch) {
          epoch = nodeInfo.epoch;
        }
        const endpoint = endPoints[index];
        const pubKx = nodeInfo.public_key.X;
        const pubKy = nodeInfo.public_key.Y;
        indexes.push(parseInt(nodeInfo.node_index, 10));
        updatedBaseEndpoints.push(endpoint);
        updatedSSSEndpoints.push(`${endpoint}/sss/jrpc`);
        updatedRSSEndpoints.push(`${endpoint}/rss`);
        updatedTSSEndpoints.push(`${endpoint}/tss`);
        updatedNodePub.push({ X: pubKx, Y: pubKy });
      }

      const nodeDetails: INodeDetails = {
        currentEpoch: epoch,
        torusNodeEndpoints: updatedBaseEndpoints,
        torusNodeSSSEndpoints: updatedSSSEndpoints,
        torusNodeRSSEndpoints: updatedRSSEndpoints,
        torusNodeTSSEndpoints: updatedTSSEndpoints,
        torusNodePub: updatedNodePub,
        torusIndexes: indexes,
      };

      try {
        redisClient.setEx(cacheKey, NODE_INFO_EXPIRY, JSON.stringify(nodeDetails));
      } catch (error) {
        log.warn("Error while setting cached nodes info", error);
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
