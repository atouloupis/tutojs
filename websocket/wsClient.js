#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
var jsonfile = require('jsonfile');
var treatment1 = require('treatmentFrame');
//function test (message){console.log(message)};

 
var rqstTicker = {   "method": "subscribeTicker",   "params": {     "symbol": "IXTETH"   },   "id": 123 }; 
var rqstAuth = {   "method": "login",   "params": {     "algo": "BASIC",     "pKey": "75ea4dceeb285ee86c026d62700df14f",     "sKey": "919c86f1a996fa98ba4fc74ebb1a364d"   } };
var rqstReport = {   "method": "subscribeReports",   "params": {} }; 
var file = 'data.json';

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
    connection.on('message', function (message) { var utf8message=message.utf8Data; treatment1.splitFrame(utf8message);});

    function sendRequest(rqst) {
        if (connection.connected) {
            connection.send(JSON.stringify(rqst));
        }
    }
    sendRequest(rqstTicker);
	sendRequest(rqstAuth);
	sendRequest(rqstReport);
});
client.connect('wss://api.hitbtc.com/api/2/ws');