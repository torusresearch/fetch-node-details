FROM node:16-alpine

WORKDIR /app

ENV NODE_OPTIONS --max-old-space-size=4096

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++

COPY package*.json .

RUN npm install

COPY . .

CMD cd packages/fnd-server && npm run build && npm run prod