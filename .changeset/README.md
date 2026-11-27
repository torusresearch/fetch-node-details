# Changesets

Add a changeset to each PR that changes what ships: `npm run changeset`. The `changeset` check requires one unless every changed file is on the allowlist (`NO_CHANGESET_PATHS` in `.github/workflows/changeset.yml`): CI workflows, editor settings, docs, `README.md`, `CHANGELOG.md`, tests, and the CI-only check scripts. Any other file needs an entry, including build config such as `tsconfig.json`, `.nvmrc`, and `.yarnrc.yml`. For a one-off PR that needs no entry, add the `skip-changeset` label.

The four packages share one version (`fixed` group), matching the previous Lerna setup.
Run the "Create release pull request" workflow on `master` to open the version PR. Publishing stays manual.
