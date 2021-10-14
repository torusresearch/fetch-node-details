import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";
import path from "path";
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
      replace({
        "process.env.INFURA_PROJECT_ID": `"${process.env.INFURA_PROJECT_ID}"`,
        preventAssignment: true,
      }),
      typescript({ tsconfig: path.resolve(".", "tsconfig.build.json"), moduleResolution: "node" }),
      sourceMaps(),
    ],
  },
];
