const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const { EnvironmentPlugin, ProvidePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

require("dotenv").config({ path: ".env" });

const pkg = require("./package.json");

const pkgName = "fetchNodeDetails";
const libraryName = pkgName.charAt(0).toUpperCase() + pkgName.slice(1);

const { NODE_ENV = "production" } = process.env;

const baseConfig = {
  mode: NODE_ENV,
  devtool: NODE_ENV === "production" ? false : "source-map",
  entry: "./index.js",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    library: {
      name: libraryName,
      export: "default",
    },
  },
  resolve: {
    alias: {
      "bn.js": path.resolve(__dirname, "node_modules/bn.js"),
      lodash: path.resolve(__dirname, "node_modules/lodash"),
      "js-sha3": path.resolve(__dirname, "node_modules/js-sha3"),
    },
    fallback: {
      buffer: require.resolve("buffer/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      url: require.resolve("url/"),
      os: require.resolve("os-browserify/browser"),
    },
  },
  module: {
    rules: [],
  },
  plugins: [
    new EnvironmentPlugin(["INFURA_PROJECT_ID"]),
    new ProvidePlugin({
      process: "process/browser",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};

const optimization = {
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};

const babelLoaderWithPolyfills = {
  test: /\.m?js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "babel-loader",
  },
};

const babelLoader = { ...babelLoaderWithPolyfills, use: { loader: "babel-loader", options: { plugins: ["@babel/transform-runtime"] } } };

const umdPolyfilledConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.polyfill.umd.min.js`,
    library: {
      ...baseConfig.output.library,
      type: "umd",
    },
  },
  module: {
    rules: [babelLoaderWithPolyfills],
  },
};

const umdConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.umd.min.js`,
    library: {
      ...baseConfig.output.library,
      type: "umd",
    },
  },
  module: {
    rules: [babelLoader],
  },
};

const cjsConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.cjs.js`,
    library: {
      ...baseConfig.output.library,
      type: "commonjs2",
    },
  },
  module: {
    rules: [babelLoader],
  },
  externals: [...Object.keys(pkg.dependencies), /^(@babel\/runtime)/i],
};

const cjsBundledConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}-bundled.cjs.js`,
    library: {
      ...baseConfig.output.library,
      type: "commonjs2",
    },
  },
  module: {
    rules: [babelLoader],
  },
  plugins: [
    ...baseConfig.plugins,
    new ESLintPlugin({
      files: "src",
    }),
  ],
  externals: [/^(@babel\/runtime)/i],
};

const nodeConfig = {
  ...baseConfig,
  ...optimization,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}-node.js`,
    library: {
      ...baseConfig.output.library,
      type: "commonjs2",
    },
  },
  module: {
    rules: [babelLoader],
  },
  externals: [...Object.keys(pkg.dependencies), /^(@babel\/runtime)/i],
  target: "node",
};

module.exports = [umdPolyfilledConfig, umdConfig, cjsConfig, cjsBundledConfig, nodeConfig];
// module.exports = [cjsConfig];

// v5
// experiments: {
//   outputModule: true
// }
