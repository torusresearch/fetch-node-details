# @toruslabs/fetch-node-details

## 17.0.0

### Major Changes

- 5ec0893: Stack 2026 Q4 upgrade.

  - Require Node 24.22+ and npm 12.
  - Builds now use Vite+ (`vp pack`). The `dist/lib.esm` and `dist/lib.cjs` entry points are unchanged. Type declarations move to `dist/lib.cjs/index.d.ts`.
  - Drop the `@babel/runtime` peer dependency.
  - `@toruslabs/fetch-node-details` now uses `@toruslabs/http-helpers` 10.
  - `@toruslabs/fnd-server` no longer sends `Access-Control-Allow-Credentials`.
  - `@toruslabs/fnd-server` uses `@sentry/node` 11 and `@toruslabs/loglevel-sentry` 10. Automatic collection of cookies, user info, headers, and request bodies stays off.

### Patch Changes

- Updated dependencies [5ec0893]
  - @toruslabs/constants@17.0.0
  - @toruslabs/fnd-base@17.0.0
