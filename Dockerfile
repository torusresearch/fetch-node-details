FROM node:20-alpine

WORKDIR /app

ENV NODE_OPTIONS --max-old-space-size=4096

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++

COPY . .

RUN npm install

RUN npm run build

CMD cd packages/fnd-server && npm run prod