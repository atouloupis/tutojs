#!/usr/bin/env node


var jsonfile = require('jsonfile');
var treatment = require('./treatmentFrame');

var rqstTicker = {   "method": "subscribeTicker",   "params": {     "symbol": "IXTETH"   },   "id": 123 }; 
var rqstTicker1 = {   "method": "subscribeTicker",   "params": {     "symbol": "BQXETH"   },   "id": 123 }; 
var rqstAuth = {   "method": "login",   "params": {     "algo": "BASIC",     "pKey": "75ea4dceeb285ee86c026d62700df14f",     "sKey": "919c86f1a996fa98ba4fc74ebb1a364d"   } };
var rqstReport = {   "method": "subscribeReports",   "params": {} }; 
var file = 'data.json';

// var WebSocketClient = require('websocket').client;
//var client = new WebSocketClient();
 
// client.on('connectFailed', function(error) {
    // console.log('Connect Error: ' + error.toString());
// });
 
// client.on('connect', function(connection) {
    // console.log('WebSocket Client Connected');
    // connection.on('error', function(error) {
        // console.log("Connection Error: " + error.toString());
    // });
    // connection.on('close', function() {
        // console.log('echo-protocol Connection Closed');
    // });
    // connection.on('message', function (message) { 
		// console.log(message);
		// var utf8message=message.utf8Data; 
		// console.log(utf8message);
		// treatment.splitFrame(utf8message);
		// });

    // function sendRequest(rqst) {
        // if (connection.connected) {
            // connection.send(JSON.stringify(rqst));
			// console.log(JSON.stringify(rqst));	
        // }
    // }
    // sendRequest(rqstTicker);
	// sendRequest(rqstTicker1);
	// sendRequest(rqstTicker1);
	// sendRequest(rqstTicker1);
	// sendRequest(rqstAuth);
	// sendRequest(rqstReport);
// });
// client.connect('wss://api.hitbtc.com/api/2/ws');    



// -------


var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
var connected = false;
ws.onopen = function() {
  console.log("<p>> CONNECTED</p>");
  var connected = true;
};

ws.onmessage = function(evt) {
  console.log("<p style='color: blue;'>> RESPONSE: " + evt.data + "</p>");
};

ws.onerror = function(evt) {
  console.log("<p style='color: red;'>> ERROR: " + evt.data + "</p>");
};

function sendMessage(message) {
if (connected) {
console.log("<p>> SENT: " + message + "</p>");
ws.send(message);
	}
}

sendMessage (rqstTicker1);

// -----
// var connected = false;
// var socket = require('socket.io-client')('ws://demos.kaazing.com/echo', {
	// transports: [ 'websocket' ]
// });


// socket.on('connect', function(){
	// console.log('WebSocket Client Connected');
	// connected = true;
	// });
// socket.on('connect_error', (error) => {
	// console.log('Connection Error'+error.toString());
	// });
// socket.on('event', function (message) { 
		// console.log(message);
		// var utf8message=message.utf8Data; 
		// console.log(utf8message);
		//treatment.splitFrame(utf8message);
		// });
// socket.on('disconnect', function(){console.log('echo-protocol Connection Closed');});

// socket.on('error', (error) => {
  // console.log(error.toString());
// });

// function sendRequest(rqst) {
    // if (connected) {
		// socket.send(JSON.stringify(rqst));
		// console.log(JSON.stringify(rqst));	
    // }
// }

//sendRequest(rqstTicker1);