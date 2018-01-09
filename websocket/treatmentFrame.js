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
        }
        if (jsonFrame.method == "snapshotTrades" | jsonFrame.method == "updateTrades") {
            var tradeHistoryParams = jsonFrame.params;
            if (tradeHistoryParams != "undefined") {
                updateTradeHistory.newTradeHistory(tradeHistoryParams);
            }
        }
        if (jsonFrame.method == "activeOrders" | jsonFrame.method == "report") {
            var reportsParams = jsonFrame.params;
            if (reportsParams != "undefined") {

                updtOrders.newActiveOrders(reportsParams);
            }
        }
        if (jsonFrame.method == "updateOrderbook" | jsonFrame.method == "snapshotOrderbook") {
            var orderBookParams = jsonFrame.params;
            orderBook.updateOrderBook(orderBookParams, jsonFrame.method, function (termine) {
            });
        }
        if (jsonFrame.id == "tradingBalance") {
            var tradingBalanceResult = jsonFrame.result;
            transfer.checkCoinWithdraw(tradingBalanceResult, function () {
            });
        }
}