#!/usr/bin/env node


var jsonfile = require('jsonfile');
var treatment = require('./treatmentFrame');

var rqstTicker = {   "method": "subscribeTicker",   "params": {     "symbol": "IXTETH"   },   "id": 123 }; 
var rqstTicker1 = {   "method": "subscribeTicker",   "params": {     "symbol": "BQXETH"   },   "id": 123 }; 
var rqstAuth = {   "method": "login",   "params": {     "algo": "BASIC",     "pKey": "75ea4dceeb285ee86c026d62700df14f",     "sKey": "919c86f1a996fa98ba4fc74ebb1a364d"   } };
var rqstReport = {   "method": "subscribeReports",   "params": {} }; 
var file = 'data.json';

var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");

ws.onopen = function() {
	
	console.log("CONNECTED");
	
	ws.onerror = function(evt) {
		// console.log("ERROR: " + evt.data);
	};
	
	ws.onmessage = function(evt) {
		// console.log(" RESPONSE: " + evt.data);
		treatment.splitFrame(evt.data);
	};
	
	function sendMessage(message) {
		// console.log("SENT: " + JSON.stringify(message));
		ws.send(JSON.stringify(message));
	}
	// sendRequest(rqstTicker);
	sendRequest(rqstTicker1);
	// sendRequest(rqstAuth);
	// sendRequest(rqstReport);
};


