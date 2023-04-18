#!/bin/sh
/node_modules/.bin/wait-port 8060
sleep 10
/node_modules/.bin/mocha ./packages/fetch-node-details/test/nodeDetail.test.ts