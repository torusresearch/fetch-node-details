/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

require("dotenv").config({ path: ".env" });

const pkg = require("./package.json");

const pkgName = "fetchNodeDetailsSapphire";

exports.baseConfig = {
  resolve: {
    alias: {
      "bn.js": path.resolve(__dirname, "../../node_modules/bn.js"),
      lodash: path.resolve(__dirname, "../../node_modules/lodash"),
      "js-sha3": path.resolve(__dirname, "../../node_modules/js-sha3"),
    },
  },
};

exports.nodeConfig = {
  optimization: {
    minimize: false,
  },
  output: {
    filename: `${pkgName}-node.js`,
    library: {
      type: "commonjs2",
    },
  },
  externals: [...Object.keys(pkg.dependencies), /^(@babel\/runtime)/i],
  target: "node",
};
