var updtOrders = require('./updateActiveOrders');
var updateTradeHistory = require('./updateTradeHistory');
var checkOrder = require('./checkOrder');
var orderBook = require('./orderBook');
var mongoDb = require('./mongoDb');
var api = require('./getRestFull');
var transfer = require('./transferCoin');

module.exports.splitFrame = splitFrame;

function splitFrame(jsonFrame) {
    var date = new Date;
    var collectionName = "symbol";
    mongoDb.createCollection(collectionName, function () {
        if (date.getHours() == 0) {
            api.getHitBTC("/api/2/symbol","GET", function (symbol) {
                mongoDb.deleteRecords(collectionName, "", function () {
                    mongoDb.insertCollection(collectionName, symbol, function () {
                    })
                });
            });
        }
        console.log(jsonFrame);
        jsonFrame = JSON.parse(jsonFrame);
        //console.log("0"+JSON.stringify(jsonFrame));
        if (jsonFrame.method == "ticker") {
            //console.log(JSON.stringify(jsonFrame.params));
            checkOrder.hasAnOrder(jsonFrame);
        }
        if (jsonFrame.method == "snapshotTrades" | jsonFrame.method == "updateTrades") {
            // console.log("###"+JSON.stringify(jsonFrame));
            var tradeHistoryParams = jsonFrame.params;
            if (tradeHistoryParams != "undefined") {
                // console.log("##########"+JSON.stringify(activeOrderParams));
                updateTradeHistory.newTradeHistory(tradeHistoryParams);
                // console.log(JSON.stringify(activeOrderParams[i]));
            }
        }
        if (jsonFrame.method == "activeOrders" | jsonFrame.method == "report") {
            // console.log("###"+JSON.stringify(jsonFrame));
            var reportsParams = jsonFrame.params;
            if (reportsParams != "undefined") {
                // console.log("##########"+JSON.stringify(activeOrderParams));
                updtOrders.newActiveOrders(reportsParams);
                // console.log(JSON.stringify(activeOrderParams[i]));
            }
        }
        if (jsonFrame.method == "updateOrderbook" | jsonFrame.method == "snapshotOrderbook") {
            var orderBookParams = jsonFrame.params;
            orderBook.updateOrderBook(orderBookParams, jsonFrame.method, function (termine) {
                console.log(termine)
            });
        }
        if (jsonFrame.id == "tradingBalance") {
            var tradingBalanceResult = jsonFrame.result;
            transfer.checkCoinWithdraw(tradingBalanceResult, function () {
            });
        }
    });
}