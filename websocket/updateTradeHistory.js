module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');

function newTradeHistory(frame) {
    var collectionName = "tradeHistory";
    mongoDb.createCollection(collectionName, function () {
				console.log("NewTradeHistory");
			console.log(frame.data.length);
        for (var i = 0; i < frame.data.length; i++) {
		
            var queryUpdate = {id:'123', price:'123', quantity:'123', side:'123', timestamp:'123', symbol:'123'};
			console.log("NewTradeHistory");
			console.log(queryUpdate);
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });
}