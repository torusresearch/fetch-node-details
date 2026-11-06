---
"@toruslabs/constants": major
"@toruslabs/fnd-base": major
"@toruslabs/fetch-node-details": major
"@toruslabs/fnd-server": major
---

Stack 2026 Q4 upgrade.

- Require Node 24.22+ and npm 12.
- Builds now use Vite+ (`vp pack`). The `dist/lib.esm` and `dist/lib.cjs` entry points are unchanged. Type declarations move to `dist/lib.cjs/index.d.ts`.
- Drop the `@babel/runtime` peer dependency.
- `@toruslabs/fetch-node-details` now uses `@toruslabs/http-helpers` 10.
- `@toruslabs/fnd-server` no longer sends `Access-Control-Allow-Credentials`.
- `@toruslabs/fnd-server` uses `@sentry/node` 11 and `@toruslabs/loglevel-sentry` 10. Automatic collection of cookies, user info, headers, and request bodies stays off.
