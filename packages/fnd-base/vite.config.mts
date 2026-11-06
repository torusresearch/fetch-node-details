import { libraryPreset } from "@toruslabs/torus-scripts/library";
import { defineConfig } from "vite-plus";

const { pack } = libraryPreset({ entry: "src/index.ts", format: ["esm", "cjs"] });

export default defineConfig({
  pack: {
    ...pack,
    platform: "neutral",
    target: "es2022",
    format: {
      esm: { outDir: "dist/lib.esm" },
      cjs: { outDir: "dist/lib.cjs" },
    },
    outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
  },
});
