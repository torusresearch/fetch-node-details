import { errors } from "celebrate";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import log from "loglevel";
import morgan from "morgan";
import fetch from "node-fetch";
import path from "path";

import router from "./router";
import { registerSentry, registerSentryErrorHandler } from "./utils/sentry";

(globalThis as any).fetch = fetch;
// setup environment
const envPath = path.resolve("../../../", process.env.NODE_ENV !== "production" ? ".env.development" : ".env");
dotenv.config({
  path: envPath,
});

log.setLevel((process.env.LOG_LEVEL as log.LogLevelDesc) || "DEBUG");

const port = process.env.NODE_PORT || process.argv[2] || 8060;

// Catch all errors, including exceptions in wasm
process.on("uncaughtException", function (err) {
  console.log(`Caught exception: ${err}`);
});

const app = express();

registerSentry(app);

app.set("trust proxy", 1);

// setup middleware
const corsOptions = {
  //   origin: ["https://localhost:3000", /\.tor\.us$/],
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "x-api-key", "x-embed-host", "sentry-trace", "baggage", "x-web3-correlation-id"],
  methods: "GET,POST",
  maxAge: 86400,
};

app.use(compression());
app.use(cors(corsOptions));
app.use(helmet()); // middleware which adds http headers
app.use(express.json());
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") app.use(morgan("dev")); // HTTP logging

app.disable("x-powered-by");

// Register app routes.
app.use("/", router);
app.use(errors());

registerSentryErrorHandler(app);

const server = createServer(app);
server.keepAliveTimeout = 301 * 1000;
server.headersTimeout = 305 * 1000;

server.listen(port, () => {
  console.log("app listening on port", port);
});

export default app;
