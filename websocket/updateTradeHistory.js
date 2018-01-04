module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');

function newTradeHistory(frame) {
    var collectionName = "tradeHistory";
    mongoDb.createCollection(collectionName, function () {
				// console.log("NewTradeHistory");
			// console.log(frame);
        for (var i = 0; i < frame.data.length; i++) {
		var id=frame.data[i].id;
		var price=frame.data[i].price;
		var quantity=frame.data[i].quantity;
		var side=frame.data[i].side;
		var timestamp=frame.data[i].timestamp;
		var symbol=frame.symbol;
            var queryUpdate = {id:id, price:price, quantity:quantity, side:side, timestamp:timestamp, symbol:symbol};
			// db.tradeHistory.update({ id: '132614043', price: '1.292738', quantity: '0.01', side: 'sell', timestamp: '2018-01-03T14:23:44.623Z', s
// ymbol: 'DASHETH' },{ id: '132614043', price: '1.292738', quantity: '0.01', side: 'sell', timestamp: '2018-01-03T14:23:44.623Z', symbol:
 // 'DASHETH' },{upsert:true})
			console.log(queryUpdate);
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });
}