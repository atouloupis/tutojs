module.exports.getActiveOrders = getActiveOrders;
module.exports.getLastBuyTrade = getLastBuyTrade;
module.exports.getLastTrades = getLastTrades;
var mongoDb = require('./mongoDb');

function getActiveOrders (symbol,callback)
{
var collectionName="activeOrders";
var i=0;
mongoDb.findRecords(collectionName,{"symbol":symbol},function(allOrders){

	for (i=0;i<allOrders.length;i++)
		{
		if (allOrders[i].status == "new" || allOrders[i].status == "partiallyFilled") 
			{
			callback (allOrders[i]);
			}
		}
	if (i==allOrders.length){
	    callback();
    }
	});
}


function getLastBuyTrade (symbol,callback)
{
var collectionName="activeOrders";
var i=0;
mongoDb.findRecords(collectionName,{"symbol":symbol},function(allOrders){
	for (i=0;i<allOrders.length;i++)
		{
		if (allOrders[i].status == "filled" & allOrders[i].side == "buy") 
			{
			callback (allOrders[i]);
			break;
			}
		}
	if (i==allOrders.length)callback();
	});
}

function getLastTrades (symbol,number,callback)
{
var lastTrades=[];
var collectionName = "tradeHistory";
var i=0;
mongoDb.findRecords(collectionName,{"symbol":symbol},function(allTrades){
	if (number>allTrades.length)callback(lastTrades);
	else{
	for (i=0;i<number;i++)
		{
		if (allTrades[i].side == "sell") 
			{
			lastTrades.push(allTrades[i]);
			}
		}
	if (i==number)callback(lastTrades);
	}
	});
}