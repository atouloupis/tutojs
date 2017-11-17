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
        //if (message.type === 'utf8') {
            console.log("Received: '" + JSON.stringify(message) + "'");
			//return JSON.stringify(message);;
        //}
    });
    function sendRequest() {
        if (connection.connected) {
            var request = JSON.stringify('{   "method": "subscribeTicker",   "params": {     "symbol": "ETHBTC"   },   "id": 123 }');
            connection.send(request);
        }
    }
    sendRequest();
});
 
client.connect('wss://api.hitbtc.com/api/2/ws');