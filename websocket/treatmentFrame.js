var updtOrders = require('./updateActiveOrders');
var checkOrder = require('./checkOrder');
var orderBook = require('./orderBook');
var mongoDb = require('./mongoDb');
var get = require('./getRestFull')

module.exports.splitFrame = splitFrame;

function splitFrame(jsonFrame) {
    var date = new Date;
    var collectionName = "symbol";
    mongoDb.createCollection(collectionName, function () {
        if (date.getHours() == 0) {
            get.getHitBTC("/api/2/symbol", function (symbol) {
                mongoDb.deleteRecords(collectionName, "", function () {
                    mongoDb.insertCollection(collectionName, symbol, function () {
                    })
                });
            });
        }
        var jsonFrame = JSON.parse(jsonFrame);
        //console.log("0"+JSON.stringify(jsonFrame));
        if (jsonFrame.method == "ticker") {
            //console.log(JSON.stringify(jsonFrame.params));
            checkOrder.hasAnOrder(jsonFrame);
        }
        if (jsonFrame.method == "activeOrders" | jsonFrame.method == "report") {
            // console.log("###"+JSON.stringify(jsonFrame));
            var activeOrderParams = jsonFrame.params;
            if (activeOrderParams != "undefined") {
                // console.log("##########"+JSON.stringify(activeOrderParams));
                updtOrders.newActiveOrders(activeOrderParams);
                // console.log(JSON.stringify(activeOrderParams[i]));
            }
        }
        if (jsonFrame.method == "updateOrderbook" | jsonFrame.method == "snapshotOrderbook") {
            var activeOrderParams = jsonFrame.params;
            orderBook.updateOrderBook(activeOrderParams, jsonFrame.method, function (termine) {
                console.log(termine)
            });

        }
    });
}