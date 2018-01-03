module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');

function newTradeHistory(frame) {
    var collectionName = "tradeHistory";
    mongoDb.createCollection(collectionName, function () {
				// console.log("NewTradeHistory");
			// console.log(frame);
        for (var i = 0; i < frame.data.length; i++) {
		
            var queryUpdate = {igrd:frame.data[i].id, price:frame.data[i].price, quantity:frame.data[i].quantity, side:frame.data[i].side, timestamp:frame.data[i].timestamp, symbol:frame.symbol};
			// console.log("NewTradeHistory");
			// console.log(queryUpdate);
            // mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });
}