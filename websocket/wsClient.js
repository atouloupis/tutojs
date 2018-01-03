#!/usr/bin/env node

var mongoClient = require('mongodb').MongoClient;
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var treatment = require('./treatmentFrame');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var schedule = require('node-schedule');
var j = schedule.scheduleJob('/2 * * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});
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
        "symbol": "IXTETH"
    },
    "id": 123
};
var rqstTicker1 = {
    "method": "subscribeTicker",
    "params": {
        "symbol": "BQXETH"
    },
    "id": 123
};
var rqstAuth = {
    "method": "login",
    "params": {
        "algo": "BASIC",
        "pKey": "75ea4dceeb285ee86c026d62700df14f",
        "sKey": "919c86f1a996fa98ba4fc74ebb1a364d"
    }
};
var rqstReport = {
    "method": "subscribeReports",
    "params": {}
};
var rqstOrderBook = {
    "method": "subscribeOrderbook",
    "params": {
        "symbol": "ATSETH"
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

    ws.onopen = function () {

        console.log("CONNECTED");

        ws.onerror = function (evt) {
            // console.log("ERROR: " + evt.data);
        };

        ws.onmessage = function (evt) {
            // console.log(" RESPONSE: " + evt.data);
            treatment.splitFrame(evt.data);
        };

        function sendRequest(message) {
            // console.log("SENT: " + JSON.stringify(message));
            ws.send(JSON.stringify(message));
        }

        // sendRequest(rqstTicker);
        //sendRequest(rqstTicker1);
        // sendRequest(rqstAuth);
        // sendRequest(rqstReport);
        //sendRequest(rqstOrderBook);
    };
});