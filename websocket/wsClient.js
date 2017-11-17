#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();
 
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    function sendRequest() {
        if (connection.connected) {
            var request = '{   "method": "getCurrency",   "params": {     "currency": "ETH"   },   "id": 123 }';
            connection.send(request);
      //      setTimeout(sendRequest, 5000);
        }
    }
    sendRequest();
});
 
client.connect('wss://api.hitbtc.com/api/2/ws');