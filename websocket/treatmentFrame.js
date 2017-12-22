    mongoClient.connect(urlOrderBook, function(err, db) {
	if (err) throw err;
	var dbOrderBook=db.db("orderBook");
	exports.dbase=dbOrderBook;
	console.log(dbOrderBook);
	module.exports.splitFrame = splitFrame;
var updtOrders = require ('./updateActiveOrders');
var checkOrder = require ('./checkOrder');
var orderBook = require ('./orderBook');
var mongoClient = require('mongodb').MongoClient;
var urlOrderBook = "mongodb://localhost:27017/orderBook";
	});





function splitFrame (jsonFrame){
	var jsonFrame = JSON.parse(jsonFrame);
	//console.log("0"+JSON.stringify(jsonFrame));
	if (jsonFrame.method == "ticker")
	{
		//console.log(JSON.stringify(jsonFrame.params));
		checkOrder.hasAnOrder(jsonFrame);
	}
	if (jsonFrame.method == "activeOrders" | jsonFrame.method == "report")
	{
		// console.log("###"+JSON.stringify(jsonFrame));
		var activeOrderParams = jsonFrame.params;
		if (activeOrderParams != "undefined")
			{
			// console.log("##########"+JSON.stringify(activeOrderParams));
			updtOrders.newActiveOrders(activeOrderParams);
			// console.log(JSON.stringify(activeOrderParams[i]));

			}
	}
	if (jsonFrame.method == "updateOrderbook" | jsonFrame.method == "snapshotOrderbook")
	{
	var activeOrderParams = jsonFrame.params;
	orderBook.updateOrderBook(activeOrderParams, jsonFrame.method,function(termine){console.log(termine)});
	}
};