---
---

Resolve code-scanning alerts: declare `credentials: false` in the fnd-server CORS config, install production dependencies as the `node` user and copy them into the runtime image as root (no `COPY --chown`), and drop the unused `tzdata` Alpine package.
