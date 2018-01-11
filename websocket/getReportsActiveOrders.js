module.exports.getActiveOrders = getActiveOrders;
module.exports.getLastBuyTrade = getLastBuyTrade;
module.exports.getLastTrades = getLastTrades;
var mongoDb = require('./mongoDb');
var api = require('./getRestFull');

function getActiveOrders (symbol,callback)
{
var collectionName="activeOrders";

mongoDb.findRecords(collectionName,{"symbol":symbol},{_id: -1},function(allOrders){

    for (var i=0;i<allOrders.length;i++)
		{
		if (allOrders[i].status == "new" || allOrders[i].status == "partiallyFilled")
			{
			callback (allOrders[i]);
			}
           else if (i==allOrders.length-1){
                callback();
            }
		}
		if (allOrders.length==0)callback();

	});
}


function getLastBuyTrade (symbol,callback)
{
api.getHitBTC("/api/2/history/trades","get",function (err,allOrders) {

	for (var i=0;i<allOrders.length;i++)
		{
		if (allOrders[i].side == "buy" && allOrders[i].symbol==symbol) 
			{
			// console.log("all order ID");
			// console.log(allOrders[i]);
			callback (allOrders[i]);
			break;
			}
		else if (i==allOrders.length)callback();
		}
    if (allOrders.length==0)callback();
});
}

function getLastTrades (symbol,number,callback)
{
var lastTrades=[];
var collectionName = "tradeHistory";
mongoDb.findRecords(collectionName,{"symbol":symbol},{timestamp: -1},function(allTrades){
	if (number>allTrades.length)callback(lastTrades);
	else{
	for (var i=0;i<number;i++)
		{
		if (allTrades[i].side == "sell") 
			{
			lastTrades.push(allTrades[i]);
			}

		}
        if (i==number)callback(lastTrades);
        if (number==0)callback(lastTrades);
	}
	});
}