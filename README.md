# Fetch-Node-Details

[![npm version](https://badge.fury.io/js/%40toruslabs%2Ffetch-node-details.svg)](https://badge.fury.io/js/%40toruslabs%2Ffetch-node-details)

## Introduction

Use this package to fetches details about Torus nodes, from a specified Smart Contract that holds details about the list of nodes & network.
This will dynamically get updates about the node list, allowing the front end to continue querying the different set of nodes after migrations.

This utility library serves to find the endpoints and public keys associated
with the current set of qualified nodes, which are used for key lookups, key
assignments, and key retrievals by other dependent libraries.

## Features

- Multi network support
- Allows passing in custom provider + contract address for querying node info
- Caching
- Typescript compatible
- All API's return `Promises`

## Getting Started

Add [`@toruslabs/fetch-node-details`](https://www.npmjs.com/package/@toruslabs/fetch-node-details) to your project:

```js
import FetchNodeDetails from "@toruslabs/fetch-node-details";

const fetchNodeDetails = new FetchNodeDetails();
const nodeInfo = await fetchNodeDetails.getNodeDetails();
```

## Requirements

- Node 10+
