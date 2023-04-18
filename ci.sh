#!/bin/sh
npm run dev &
/app/node_modules/.bin/wait-port 8060
sleep 10
npm run test