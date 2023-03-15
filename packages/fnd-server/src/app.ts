import { errors } from "celebrate";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import log from "loglevel";
import morgan from "morgan";
import path from "path";

import router from "./router";
import { registerSentry, registerSentryErrorHandler } from "./utils/sentry";

// setup environment
const envPath = path.resolve("../../../", process.env.NODE_ENV !== "production" ? ".env.development" : ".env");
dotenv.config({
  path: envPath,
});

log.setLevel((process.env.LOG_LEVEL as log.LogLevelDesc) || "DEBUG");

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
  allowedHeaders: ["Content-Type", "x-api-key", "x-embed-host", "sentry-trace", "baggage", "x-web3-correlation-id", "x-web3-session-id"],
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

export default app;
