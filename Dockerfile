FROM node:16-alpine

WORKDIR /app

ENV NODE_OPTIONS --max-old-space-size=4096

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++

COPY packages/fnd-server/package*.json .

RUN npm install && apk del .gyp

COPY packages/fnd-server .

CMD  npm run build && npm run prod