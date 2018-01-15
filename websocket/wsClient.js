#!/usr/bin/env node

var jsonfile = require('jsonfile');
var keyfile = './key.json';
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
var symbol = 'SMARTETH';

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
    exports.dbase = db.db("orderBook");

    mongoDb.createCollection("symbol", function () {
        mongoDb.createCollection("activeOrders", function () {
            mongoDb.createCollection("orderBookFrame", function () {
                mongoDb.createCollection("tradeHistory", function () {
                    mongoDb.dropCollection("activeOrders", function () {});
                    mongoDb.dropCollection("orderBookFrame", function () {});
                    mongoDb.dropCollection("tradeHistory", function () {});
        var collectionName = "symbol";
        api.getHitBTC("/api/2/public/symbol", "GET", function (err, symbol) {
            if (err) throw err;
            console.log("wsClient1");
            mongoDb.dropCollection(collectionName, function () {
;
                mongoDb.insertCollection(collectionName, symbol, function () {

                    mongoDb.createIndex(collectionName, "{id:1}", function () {
                    });
                });
            });
        });
        schedule.scheduleJob('*/5 * * * *', function () {
            api.getHitBTC("/api/2/public/symbol", "GET", function (err, symbol) {
                if (err) console.log(err);
                else {
                    console.log("wsClient2");
                    mongoDb.dropCollection(collectionName, function () {
                        mongoDb.insertCollection(collectionName, symbol, function () {
                        });
                    });
                }
            });
        });
        jsonfile.readFile(keyfile, function (err, obj) {
            var rqstAuth = {
                "method": "login",
                "params": {
                    "algo": "BASIC",
                    "pKey": obj.hitbtc.pKey,
                    "sKey": obj.hitbtc.sKey
                }
            };
            webSocketCall(rqstAuth);
        });
    });
});
});
});
});


function webSocketCall(rqstAuth){
					 ws.onopen = function () {

        console.log("CONNECTED");

        ws.onerror = function (evt) {
        };

        ws.onmessage = function (evt) {
            treatment.splitFrame(evt.data);
			if (JSON.parse(evt.data).method=="snapshotOrderbook")
			{ 
			sendRequest(rqstAuth);
			sendRequest(rqstReport);
			}
			else if (JSON.parse(evt.data).method== "activeOrders") sendRequest(rqstSnapshotTrades);
			else if (JSON.parse(evt.data).method=="snapshotTrades")sendRequest(rqstTicker);
			else {}
        };

        function sendRequest(message) {
            ws.send(JSON.stringify(message));
        }
		sendRequest(rqstOrderBook);
		//update orderbook every 10 sec
		var j = schedule.scheduleJob('*/20 * * * * *', function(){
		sendRequest(rqstOrderBook);
		});
    };
}