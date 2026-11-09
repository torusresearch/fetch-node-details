FROM node:24.22.1-alpine AS base

# The npm binary stays root-owned. Application dependencies are installed below, as node.
RUN npm install --global npm@12.2.0

ENV NODE_OPTIONS=--max-old-space-size=4096

# /home/node already belongs to node. COPY always runs as root, so the manifests
# are handed over with chown instead of COPY --chown, which is what KICS flags.
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json package-lock.json .npmrc ./
COPY packages/constants/package.json packages/constants/
COPY packages/fnd-base/package.json packages/fnd-base/
COPY packages/fetch-node-details/package.json packages/fetch-node-details/
COPY packages/fnd-server/package.json packages/fnd-server/

USER root
RUN chown -R node:node /home/node/app
USER node

# for build
FROM base AS build

USER root
COPY . .
RUN chown -R node:node /home/node/app
USER node

RUN npm ci --no-audit --no-fund

RUN npm run build -w @toruslabs/constants -w @toruslabs/fnd-base \
 && npm run build -w @toruslabs/fnd-server

# production dependencies, installed as node
FROM base AS prod-deps

RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# BuildKit keeps the source owner on COPY --from, so the node-owned install
# arrives owned by node. Reassign it to root. There is no --chown flag for KICS to flag.
FROM node:24.22.1-alpine

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

COPY --from=prod-deps /home/node/app ./
COPY --from=build /home/node/app/packages/constants/dist packages/constants/dist
COPY --from=build /home/node/app/packages/fnd-base/dist packages/fnd-base/dist
COPY --from=build /home/node/app/packages/fnd-server/dist packages/fnd-server/dist

RUN chown -R root:root /app

WORKDIR /app/packages/fnd-server

USER node

EXPOSE 8060

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT:-8060}/health" || exit 1

CMD ["node", "dist/index.js"]
