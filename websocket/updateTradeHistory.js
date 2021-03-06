module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');

function newTradeHistory(frame) {
    var collectionName = "tradeHistory";
        for (var i = 0; i < frame.data.length; i++) {
		var id=frame.data[i].id;
		var price=frame.data[i].price;
		var quantity=frame.data[i].quantity;
		var side=frame.data[i].side;
		var timestamp=frame.data[i].timestamp;
		var symbol=frame.symbol;
            var queryUpdate = {id:id, price:price, quantity:quantity, side:side, timestamp:timestamp, symbol:symbol};
            mongoDb.updateCollection(collectionName, queryUpdate, {$set:queryUpdate}, function () {
                mongoDb.createIndex(collectionName,"{symbol:1,timestamp:-1}",function(){});
            });
        }
}