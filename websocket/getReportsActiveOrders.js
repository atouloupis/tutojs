module.exports.getActiveOrders = getActiveOrders;
module.exports.getLastBuyTrade = getLastBuyTrade;
module.exports.getLastTrades = getLastTrades;
var mongoDb = require('./mongoDb');

function getActiveOrders (symbol,callback)
{
var collectionName="activeOrders";
var i=0;
mongoDb.findRecords(collectionName,{"symbol":symbol},function(allOrders){
	for (i=0;i<allOrders.lenght;i++)
		{
		if (allOrders[i].status == "new" || allOrders[i].status == "partiallyFilled") 
			{
			callback (allOrders[i]);
			}
		}
	if (i==allOrders.lenght-1)callback();
	});
}


function getLastBuyTrade (symbol,callback)
{
var collectionName="activeOrders";
var i=0;
mongoDb.findRecords(collectionName,{"symbol":symbol},function(allOrders){
	for (i=0;i<allOrders.lenght;i++)
		{
		if (allOrders[i].status == "filled" & allOrders[i].side == "buy") 
			{
			callback (allOrders[i]);
			break;
			}
		}
	if (i==allOrders.lenght-1)callback();
	});
}

function getLastTrades (symbol,number,callback)
{
var lastTrades=[];
var collectionName = "tradeHistory";
var i=0;
mongoDb.findRecords(collectionName,{"symbol":symbol},function(allTrades){
	for (i=0;i<number;i++)
		{
		if (allTrades[i].side == "sell") 
			{
			lastTrades.push(allTrades[i]);
			}
		}
	if (i==number-1)callback(lastTrades);
	});
}