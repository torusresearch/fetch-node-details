import * as Sentry from "@sentry/node";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Middleware to add requestId to the response header
export const requestIdMiddleware = (_: Request, res: Response, next: NextFunction): void => {
  const requestId = uuidv4(); // Generate a unique requestId
  res.locals.requestId = requestId; // Set the requestId in the response locals
  res.setHeader("X-Request-Id", requestId); // Set the requestId in the response header
  Sentry.getCurrentScope().setExtra("requestId", requestId);
  next(); // Proceed to the next middleware or route handler
};
