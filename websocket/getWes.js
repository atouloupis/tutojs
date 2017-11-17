var wsClient = require ('wsClient');

message = wsClient.message;

console.log("Received: '" + message.utf8Data + "'");