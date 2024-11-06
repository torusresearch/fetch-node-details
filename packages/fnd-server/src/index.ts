import "./utils/instrument";

import * as Sentry from "@sentry/node";
import { errors } from "celebrate";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import log, { levels, LogLevelDesc } from "loglevel";
import morgan from "morgan";

// Setup environment
dotenv.config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
});
log.setLevel((process.env.LOG_LEVEL as LogLevelDesc) || levels.INFO);

import router from "./router";
import { traceContextMiddleware } from "./utils/traceContext";

// setup app
process.on("uncaughtException", (err) => {
  log.error(err, "uncaughtException");
});

// setup app
const app = express();
const port = process.env.PORT || process.argv[2] || 8060;
const http = createServer(app);

http.keepAliveTimeout = 301 * 1000;
http.headersTimeout = 305 * 1000;

app.set("trust proxy", 1);

// setup middleware
const corsOptions = {
  //   origin: ["https://localhost:3000", /\.tor\.us$/],
  origin: true,
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "x-api-key",
    "x-embed-host",
    "sentry-trace",
    "baggage",
    "x-web3-correlation-id",
    "pubkeyx",
    "pubkeyy",
    "verifier",
    "verifier_id",
    "verifierId",
    "clientId",
    "network",
    "enable_gating",
    "enableGating",
    "authorization",
  ],
  methods: "GET,PUT,PATCH,POST,DELETE",
  maxAge: 86400,
};

app.use(compression());
app.use(cors(corsOptions));
app.use(helmet()); // middleware which adds http headers
app.use(express.json());
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") app.use(morgan("dev")); // HTTP logging

app.disable("x-powered-by");

app.use(traceContextMiddleware);

app.use("/", router);
app.use("/fnd-service", router);

// Add this after all routes,
// but before any and other error-handling middlewares are defined
Sentry.setupExpressErrorHandler(app);

app.use(errors());

http.listen(port, () => {
  log.info("app listening on port", port);
});

export default app;
