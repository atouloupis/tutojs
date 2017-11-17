#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
var jsonfile = require('jsonfile');
 
var rqst = {   method: "subscribeTicker",   params: {     symbol: "ETHBTC"   },   id: 123 }; 
var file = 'data.json';

var client = new WebSocketClient();
 
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection,rsqt) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        //if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
			 jsonfile.writeFile(file, JSON.parse(message.utf8Data),{flag: 'a'}, function (err) {
				 console.error(err)
			 })
 
			return JSON.parse(message.utf8Data);
        //}
    });
    function sendRequest(rqst) {
        if (connection.connected) {
            var request = {   method: "subscribeTicker",   params: {     symbol: "ETHBTC"   },   id: 123 };
            connection.send(JSON.stringify(rqst));
        }
    }
    sendRequest(rqst);
});
client.connect('wss://api.hitbtc.com/api/2/ws',rqst);