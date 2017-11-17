#!/usr/bin/env node
var wsClient = require ('./wsClient');

message = wsClient.message;

console.log("Received: '" + JSON.stringify(message) + "'");