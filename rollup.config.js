import typescript from "@rollup/plugin-typescript";
import dotenv from "dotenv";
import path from "path";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import sourceMaps from "rollup-plugin-sourcemaps";

import pkg from "./package.json";
dotenv.config();
const pkgName = "fetchNodeDetails";

export default [
  {
    input: path.resolve(".", "src", "index.ts"),
    external: [...Object.keys(pkg.dependencies)],
    output: [{ file: `dist/${pkgName}.esm.js`, format: "es", sourcemap: true }],
    plugins: [
      typescript({ tsconfig: path.resolve(".", "tsconfig.build.json"), moduleResolution: "node" }),
      injectProcessEnv({
        INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
      }),
      sourceMaps(),
    ],
  },
];
