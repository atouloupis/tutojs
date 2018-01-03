module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');

function newTradeHistory(frame) {
    var collectionName = "tradeHistory";
    mongoDb.createCollection(collectionName, function () {
				// console.log("NewTradeHistory");
			// console.log(frame);
        for (var i = 0; i < frame.data.length; i++) {
		var id=JSON.parse(frame.data[i].id);
		var price=JSON.parse(frame.data[i].price);
		var quantity=JSON.parse(frame.data[i].quantity);
		var side=JSON.parse(frame.data[i].side);
		//var timestamp=JSON.parse(frame.data[i].timestamp);
		var symbol=JSON.parse(frame.symbol);
            var queryUpdate = {"id":id, "price":price, "quantity":quantity, "side":side, "timestamp":timestamp, "symbol":symbol};
			//console.log("NewTradeHistory");
			console.log(queryUpdate);
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });
}