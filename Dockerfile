FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_OPTIONS --max-old-space-size=4096

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++

RUN npm install && apk del .gyp

COPY packages/fnd-server .

CMD cd packages/fnd-server && npm run build && npm run prod