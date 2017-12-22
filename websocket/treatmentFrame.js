module.exports.splitFrame = splitFrame;
var updtOrders = require ('./updateActiveOrders');
var checkOrder = require ('./checkOrder');
var orderBook = require ('./orderBook');

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
	var dbName = "orderBook";
	var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/" + dbName;

    MongoClient.connect(url, function(err, db) {
	orderBook.updateOrderBook(activeOrderParams, jsonFrame.method,function(termine){console.log(termine)});
	});
	}
};