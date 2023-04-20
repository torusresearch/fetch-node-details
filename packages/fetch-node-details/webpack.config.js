/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require("./package.json");
const path = require("path");
const generateWebpackConfig = require("../../webpack.config");

const pkgName = "fetchNodeDetails";

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

const currentPath = path.resolve(".");

const config = generateWebpackConfig({ currentPath, pkg });

exports.baseConfig = config.baseConfig;
