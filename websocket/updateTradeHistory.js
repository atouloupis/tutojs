module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');

function newTradeHistory(frame) {
    var collectionName = "tradeHistory";
    mongoDb.createCollection(collectionName, function () {
				console.log("NewTradeHistory");
			console.log(frame.data.length);
        for (var i = 0; i < frame.data.length; i++) {
		
            var queryUpdate = {
                "id":  toString(frame.data[i].id),
                "price":  toString(frame.data[i].price),
                "quantity":  toString(frame.data[i].quantity),
                "side":  toString(frame.data[i].side),
                "timestamp":  toString(frame.data[i].timestamp),
                "symbol": toString(frame.symbol)
            };
			JSON.parse(queryUpdate);
			console.log("NewTradeHistory");
			console.log(queryUpdate);
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });
}