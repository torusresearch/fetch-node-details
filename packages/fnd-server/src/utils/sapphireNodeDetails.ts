import {
  INodeDetails,
  INodePub,
  JRPCResponse,
  NODE,
  NodeLookupResponse,
  TORUS_NETWORK_TYPE,
  TORUS_SAPPHIRE_NETWORK_TYPE,
} from "@toruslabs/constants";
import { SAPPHIRE_NETWORK_URLS } from "@toruslabs/fnd-base";
import { generateJsonRPCObject, post } from "@toruslabs/http-helpers";
import log from "loglevel";

import redisClient from "../database/redis";
import { thresholdSame } from "./helpers";

export const getSapphireNodeDetails = async (network: TORUS_NETWORK_TYPE, cacheKey: string) => {
  try {
    const cachedInfo = await redisClient.get(cacheKey);
    if (cachedInfo) {
      const nodeDetails = JSON.parse(cachedInfo || "{}");
      if (Object.keys(nodeDetails).length > 0) {
        return nodeDetails;
      }
      log.warn("Found empty node list from cache");
    }
  } catch (error) {
    log.warn("Error while getting cached nodes info", error);
  }
  const endPoints: string[] = SAPPHIRE_NETWORK_URLS[network as TORUS_SAPPHIRE_NETWORK_TYPE];
  if (!endPoints || endPoints.length === 0) {
    throw new Error(`Unsupported network ${network}`);
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
    updatedBaseEndpoints.push(`${endpoint}/sss/jrpc`);
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
    redisClient.setEx(cacheKey, 24 * 60 * 60, JSON.stringify(nodeDetails));
  } catch (error) {
    log.warn("Error while setting cached nodes info", error);
  }

  return nodeDetails;
};
