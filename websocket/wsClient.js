#!/usr/bin/env node

var mongoClient = require('mongodb').MongoClient;
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var treatment = require('./treatmentFrame');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var schedule = require('node-schedule');
var mongoDb = require('./mongoDb');
var api = require('./getRestFull');

var symbol = 'BCHETH';

exports.io = io;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

var rqstTicker = {
    "method": "subscribeTicker",
    "params": {
        "symbol": symbol
    },
    "id": 123
};
var rqstTicker1 = {
    "method": "subscribeTicker",
    "params": {
        "symbol": "BCHETH"
    },
    "id": 123
};
var rqstAuth = {
    "method": "login",
    "params": {
        "algo": "BASIC",
        "pKey": "c400a7328769d4b0582a80365b2d8f98",
        "sKey": "1b3fde82887787cccf3c56a264a1ee5e"
    }
};
var rqstReport = {
    "method": "subscribeReports",
    "params": {}
};
var rqstOrderBook = {
    "method": "subscribeOrderbook",
    "params": {
        "symbol": symbol
    },
    "id": 123
};

var rqstSnapshotTrades = {
  "method": "subscribeTrades",
  "params": {
    "symbol": symbol
  },
  "id": 123
};

var rqstTradingBalance = { "method": "getTradingBalance", "params": {}, "id": "tradingBalance" };

var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
exports.ws = ws;

mongoClient.connect(urlOrderBook, function (err, db) {
    if (err) throw err;
    var dbOrderBook = db.db("orderBook");
    exports.dbase = dbOrderBook;
console.log("mongo connected");
		var collectionName = "symbol";
    mongoDb.createCollection(collectionName, function () {
console.log("coll created");
		            api.getHitBTC("/api/2/public/symbol","GET", function (err,symbol) {
console.log("api Get symbol");
					if (err) throw err;
                 mongoDb.deleteRecords(collectionName, {}, function () {
				 console.log("mongo delete");
					 mongoDb.insertCollection(collectionName, symbol, function () {
					 console.log("mongo insert");
					 webSeocketCall;
                     });
                 });
            });
			var l = schedule.scheduleJob('* * */12 * * *', function(){
				            api.getHitBTC("/api/2/public/symbol","GET", function (err,symbol) {
							if (err) throw err;
                mongoDb.deleteRecords(collectionName, {}, function () {
                    mongoDb.insertCollection(collectionName, symbol, function () {
                    })
                });
            });
		});	


});	
	
	
});


function webSeocketCall(){

    ws.onopen = function () {

        console.log("CONNECTED");

        ws.onerror = function (evt) {
        };

        ws.onmessage = function (evt) {
            treatment.splitFrame(evt.data);
        };

        function sendRequest(message) {
            ws.send(JSON.stringify(message));
        }
		sendRequest(rqstOrderBook);
        sendRequest(rqstAuth);
        sendRequest(rqstReport);
        sendRequest(rqstSnapshotTrades);
        sendRequest(rqstTicker);
		//update orderbook every 10 sec
		var j = schedule.scheduleJob('*/10 * * * * *', function(){
		sendRequest(rqstOrderBook);
		});
		var k = schedule.scheduleJob('*/30 * * * * *', function(){
		sendRequest(rqstReport);
		sendRequest(rqstSnapshotTrades);
		});	
    };

}