module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');

function newTradeHistory(frame) {
    var collectionName = "tradeHistory";
    mongoDb.createCollection(collectionName, function () {
        for (var i = 0; i < frame.params.data.length; i++) {

            var queryUpdate = {
                "id":  frame.params.data[i].id,
                "price":  frame.params.data[i].price,
                "quantity":  frame.params.data[i].quantity,
                "side":  frame.params.data[i].side,
                "timestamp":  frame.params.data[i].timestamp,
                "symbol":frame.params.symbol
            };
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });
}