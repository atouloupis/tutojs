var updtOrders = require('./updateActiveOrders');
var updateTradeHistory = require('./updateTradeHistory');
var checkOrder = require('./checkOrder');
var orderBook = require('./orderBook');
var transfer = require('./transferCoin');

module.exports.splitFrame = splitFrame;

function splitFrame(jsonFrame) {
 
        jsonFrame = JSON.parse(jsonFrame);

        if (jsonFrame.method == "ticker") {
            checkOrder.hasAnOrder(jsonFrame);
			console.log(1);
        }
        if (jsonFrame.method == "snapshotTrades" | jsonFrame.method == "updateTrades") {
            var tradeHistoryParams = jsonFrame.params;
            if (tradeHistoryParams != "undefined") {
                updateTradeHistory.newTradeHistory(tradeHistoryParams);
				console.log(2);
            }
        }
        if (jsonFrame.method == "activeOrders" | jsonFrame.method == "report") {
            var reportsParams = jsonFrame.params;
            if (reportsParams != "undefined") {
console.log(3);
                updtOrders.newActiveOrders(reportsParams);
            }
        }
        if (jsonFrame.method == "updateOrderbook" | jsonFrame.method == "snapshotOrderbook") {
            var orderBookParams = jsonFrame.params;
			console.log(4);
            orderBook.updateOrderBook(orderBookParams, jsonFrame.method, function (termine) {
            });
        }
        if (jsonFrame.id == "tradingBalance") {
            var tradingBalanceResult = jsonFrame.result;
			console.log(5);
            transfer.checkCoinWithdraw(tradingBalanceResult, function () {
            });
        }
    if (jsonFrame.id == "456") {
// console.log(jsonFrame);
    }
}