import { nodeLintPreset } from "@toruslabs/oxlint-config-node";
import { typescriptLintPreset } from "@toruslabs/oxlint-config-typescript";
import { formatPreset } from "@toruslabs/torus-scripts/fmt";
import { defineConfig } from "vite-plus";

const baseLint = typescriptLintPreset();
const nodeLint = nodeLintPreset();
const baseJsPlugins = new Set((baseLint.jsPlugins ?? []).map((plugin) => (typeof plugin === "string" ? plugin : plugin.name)));

export default defineConfig({
  fmt: {
    ...formatPreset(),
    ignorePatterns: ["**/dist/**", "**/coverage/**", "**/.vitest/**", "package-lock.json", "CHANGELOG.md"],
  },
  lint: {
    ...baseLint,
    overrides: [
      {
        files: ["packages/fnd-server/**"],
        env: { node: true },
        plugins: nodeLint.plugins,
        jsPlugins: (nodeLint.jsPlugins ?? []).filter((plugin) => !baseJsPlugins.has(typeof plugin === "string" ? plugin : plugin.name)),
        rules: nodeLint.rules,
      },
    ],
  },
});
