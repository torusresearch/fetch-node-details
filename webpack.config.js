const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpackMerge = require("webpack-merge");
const pkg = require("./package.json");

const pkgName = "fetchNodeDetails";

const defaultConfig = {
  mode: "production",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${pkgName}.polyfill.umd.js`,
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/transform-runtime"],
          },
        },
      },
    ],
  },
  target: "web",
  parallelism: !process.env.CI ? 4 : 1,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min.js$/,
      }),
    ],
  },
};

const outputModes = [
  { libraryTarget: "umd", filename: `dist/${pkgName}.polyfill.umd.js` },
  { libraryTarget: "umd", filename: `dist/${pkgName}.polyfill.umd.min.js` },
  { libraryTarget: "umd", filename: `dist/${pkgName}.umd.min.js` },
  { libraryTarget: "umd", filename: `dist/${pkgName}.umd.js` },
  { output: { libraryTarget: "commonjs2", filename: pkg.main }, externals: {} },
];

module.exports = [
  // browser-friendly UMD build - polyfilled with corejs 3
  // output: [
  //   {
  //     name: pkgName,
  //     file: `dist/${pkgName}.polyfill.umd.js`,
  //     format: "umd",
  //   },
  //   {
  //     name: pkgName,
  //     file: `dist/${pkgName}.polyfill.umd.min.js`,
  //     format: "umd",
  //   },
  // ],
  // plugins: [
  //   nodebns(),
  //   json(),
  //   babel({ runtimeHelpers: true }),
  //   resolve({ preferBuiltins: false, browser: true }), // so Rollup can find dependencies
  //   commonjs(), // so Rollup can convert dependencies to an ES module
  //   nodeglob({ baseDir: false, dirname: false, filename: false, global: true, process: false }),
  //   terser({ include: "*.min.*" }),
  // ],
  // browser-friendly UMD build - not polyfilled
  // {
  //   input: "index.js",
  //   output: [
  //     {
  //       name: pkgName,
  //       file: `dist/${pkgName}.umd.js`,
  //       format: "umd",
  //     },
  //     {
  //       name: pkgName,
  //       file: `dist/${pkgName}.umd.min.js`,
  //       format: "umd",
  //     },
  //   ],
  //   plugins: [
  //     nodebns(),
  //     json(),
  //     babel({ runtimeHelpers: true, plugins: ["@babel/transform-runtime"] }),
  //     resolve({ preferBuiltins: false, browser: true }), // so Rollup can find dependencies
  //     commonjs(), // so Rollup can convert dependencies to an ES module
  //     nodeglob({ baseDir: false, dirname: false, filename: false, global: true, process: false }),
  //     terser({ include: "*.min.*" }),
  //   ],
  // },
  // // CommonJS (for Node) and ES module (for bundlers) build.
  // // (We could have three entries in the configuration array
  // // instead of two, but it's quicker to generate multiple
  // // builds from a single configuration where possible, using
  // // an array for the `output` option, where we can specify
  // // `file` and `format` for each target)
  // {
  //   input: "index.js",
  //   external: [
  //     ...Object.keys(pkg.dependencies),
  //     "@babel/runtime/regenerator",
  //     "@babel/runtime/helpers/asyncToGenerator",
  //     "@babel/runtime/helpers/classCallCheck",
  //     "@babel/runtime/helpers/createClass",
  //     "@babel/runtime/helpers/defineProperty",
  //   ],
  //   output: [
  //     { file: pkg.main, format: "cjs" },
  //     { file: pkg.module, format: "es" },
  //   ],
  //   plugins: [
  //     json(),
  //     babel({ runtimeHelpers: true, plugins: ["@babel/transform-runtime"] }),
  //     nodebns(),
  //     nodeglob({ baseDir: false, dirname: false, filename: false, global: true, process: false }),
  //     terser({ include: "*.min.*" }),
  //   ],
  // },
];
