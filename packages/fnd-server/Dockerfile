# for build
FROM node:24-alpine AS build

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

COPY package.json ./

RUN npm install --ignore-scripts --no-audit --no-fund

COPY . .

RUN npm run build

# for production
FROM node:24-alpine

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node

EXPOSE 8060

CMD ["node", "dist/index.js"]
