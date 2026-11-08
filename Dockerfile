FROM node:24.22.1-alpine AS base

RUN apk add --no-cache tzdata && npm install --global npm@12.2.0 && mkdir -p /app && chown node:node /app

ENV NODE_OPTIONS=--max-old-space-size=4096

USER node

WORKDIR /app

COPY --chown=node:node package.json package-lock.json .npmrc ./
COPY --chown=node:node packages/constants/package.json packages/constants/
COPY --chown=node:node packages/fnd-base/package.json packages/fnd-base/
COPY --chown=node:node packages/fetch-node-details/package.json packages/fetch-node-details/
COPY --chown=node:node packages/fnd-server/package.json packages/fnd-server/

# for build
FROM base AS build

RUN npm ci --no-audit --no-fund

COPY --chown=node:node . .

RUN npm run build -w @toruslabs/constants -w @toruslabs/fnd-base \
 && npm run build -w @toruslabs/fnd-server

# for production
FROM base

RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --chown=node:node --from=build /app/packages/constants/dist packages/constants/dist
COPY --chown=node:node --from=build /app/packages/fnd-base/dist packages/fnd-base/dist
COPY --chown=node:node --from=build /app/packages/fnd-server/dist packages/fnd-server/dist

WORKDIR /app/packages/fnd-server

EXPOSE 8060

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT:-8060}/health" || exit 1

CMD ["node", "dist/index.js"]
