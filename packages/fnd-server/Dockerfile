# for build
FROM node:22-alpine AS build

ENV NODE_OPTIONS --max-old-space-size=4096

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build 

# for production
FROM node:22-alpine

ENV NODE_OPTIONS --max-old-space-size=4096

WORKDIR /app

COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /app/dist ./dist

CMD npm run prod
