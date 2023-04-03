/* eslint-disable @typescript-eslint/no-var-requires */

require("dotenv").config();

const path = require("path");
require("ts-node").register({ project: path.resolve("tsconfig.json"), transpileOnly: true });

const register = require("@babel/register").default;

register({
  extensions: [".ts", ".js"],
  rootMode: "upward",
});
