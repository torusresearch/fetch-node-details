const pkg = require("./package.json");

module.exports = {
  cjsBundled: true,
  bundledDeps: Object.keys(pkg.dependencies),
  analyzerMode: "disabled",
};
