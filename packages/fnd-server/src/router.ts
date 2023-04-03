import {
  getLegacyNodeDetails,
  INodeDetails,
  INodePub,
  JRPCResponse,
  NETWORK_URLS,
  NODE,
  NODE_DETAILS_MAINNET,
  NODE_DETAILS_TESTNET,
  NodeLookupResponse,
  PROXY_CONTRACT_ADDRESS,
  TORUS_NETWORK,
  TORUS_NETWORK_TYPE,
  TORUS_SAPPHIRE_NETWORK,
  TORUS_SAPPHIRE_NETWORK_TYPE,
} from "@toruslabs/fnd-base";
import { generateJsonRPCObject, post } from "@toruslabs/http-helpers";
import express, { Request, Response } from "express";
import log from "loglevel";

import redisClient from "./database/redis";
import { thresholdSame } from "./utils/helpers";

const router = express.Router();

const NODE_INFO_EXPIRY = 24 * 60 * 60; // 1 day
const getNetworkRedisKey = (network: string, verifier?: string, verifierId?: string) => {
  if (verifier && verifierId) {
    return `fnd:${network}:${verifier}:${verifierId}`;
  }
  return `fnd:${network}`;
};

router.get("/", (_req: Request, res: Response) => {
  return res.status(200).send("Welcome to the fnd server!!");
});
router.get("/health", (_req: Request, res: Response) => {
  return res.status(200).send("ok!");
});

router.get("/nodesDetails", async (req: Request, res: Response) => {
  try {
    const { skipCache, network, verifier, verifierId, proxyContractAddress } = req.query as Record<string, string>;
    const cacheKey = getNetworkRedisKey(network, verifier, verifierId);

    if (!skipCache) {
      try {
        const cachedInfo = await redisClient.get(cacheKey);
        if (cachedInfo) {
          const nodesDetails = JSON.parse(cachedInfo || "{}");
          if (Object.keys(nodesDetails).length > 0) {
            return res.status(200).json({
              nodesDetails,
              success: true,
            });
          }
          log.warn("Found empty node list from cache");
        }
      } catch (error) {
        log.warn("Error while getting cached nodes info", error);
      }
    }

    // if not a sapphire network
    if (!Object.values(TORUS_SAPPHIRE_NETWORK).includes(network as TORUS_SAPPHIRE_NETWORK_TYPE)) {
      // use static details for mainnet and testnet
      if (network === TORUS_NETWORK.MAINNET) {
        return res.status(200).json({
          nodesDetails: NODE_DETAILS_MAINNET,
          success: true,
        });
      } else if (network === TORUS_NETWORK.TESTNET) {
        return res.status(200).json({
          nodesDetails: NODE_DETAILS_TESTNET,
          success: true,
        });
      }

      if (!verifier) {
        return res.status(400).json({
          success: false,
          message: `Verifier is required in request query for ${network} network`,
        });
      }
      if (!verifierId) {
        return res.status(400).json({
          success: false,
          message: `verifierId is required in request query for ${network} network`,
        });
      }

      const _proxyContractAddress = proxyContractAddress || PROXY_CONTRACT_ADDRESS[network];
      if (!_proxyContractAddress) {
        return res.status(400).json({
          success: false,
          message: `_proxyContractAddress is required in request query for ${network} network`,
        });
      }
      const nodesDetails = await getLegacyNodeDetails({
        verifier,
        verifierId,
        network,
        proxyAddress: _proxyContractAddress,
      });
      try {
        redisClient.setEx(cacheKey, NODE_INFO_EXPIRY, JSON.stringify(nodesDetails));
      } catch (error) {
        log.warn("Error while setting cached nodes info", error);
      }
      return res.status(200).json({
        nodesDetails,
        success: true,
      });
    }
    const endPoints = NETWORK_URLS[network as TORUS_NETWORK_TYPE];
    if (!endPoints || endPoints.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Unsupported network: ${network}`,
      });
    }

    const lookupPromises = endPoints.map((x) =>
      post<JRPCResponse<NodeLookupResponse>>(`${x}/sss/jrpc`, generateJsonRPCObject("NodeDetailsRequest", {})).catch((err) =>
        log.error("node lookup request failed", err)
      )
    );

    const lookupResponses = await Promise.all(lookupPromises);

    const errorResult = thresholdSame(
      lookupResponses.map((x2) => x2 && x2.error),
      ~~(endPoints.length / 2) + 1
    );
    const threholdNodes = thresholdSame<{
      nodes: (NODE | undefined)[];
    } | void>(
      lookupResponses.map((x3) => x3 && x3.result),
      ~~(endPoints.length / 2) + 1
    );

    if (!threholdNodes && !errorResult) {
      throw new Error(`invalid results ${JSON.stringify(lookupResponses)}`);
    }

    if (errorResult) {
      throw new Error(`node lookup results do not match, ${JSON.stringify(errorResult || {})}`);
    }

    if (!threholdNodes) {
      throw new Error("Unable to reach threshold for node lookups");
    }

    const parsedNodes = threholdNodes.nodes;

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

    const nodesDetails: INodeDetails = {
      currentEpoch: epoch,
      torusNodeEndpoints: updatedBaseEndpoints,
      torusNodeSSSEndpoints: updatedSSSEndpoints,
      torusNodeRSSEndpoints: updatedRSSEndpoints,
      torusNodeTSSEndpoints: updatedTSSEndpoints,
      torusNodePub: updatedNodePub,
      torusIndexes: indexes,
    };

    try {
      redisClient.setEx(cacheKey, NODE_INFO_EXPIRY, JSON.stringify(nodesDetails));
    } catch (error) {
      log.warn("Error while setting cached nodes info", error);
    }
    return res.status(200).json({
      nodesDetails,
      success: true,
    });
  } catch (error) {
    log.error("Error while fetching nodes details", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Something went wrong",
    });
  }
});

export default router;