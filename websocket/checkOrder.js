module.exports.hasAnOrder = hasAnOrder;

function hasAnOrder (tickerFrame) {
	var activeOrders = require('../data/activeOrders.json');
	var k = 0;
	// console.log("#"+JSON.stringify(tickerFrame));
	for (var j=0;j<activeOrders.length;j++)
	{
		 // console.log("##"+JSON.stringify(activeOrders[j]));
		if (activeOrders[j].symbol == tickerFrame.params.symbol)
			{
			activeSellOrBuy(activeOrders[j],tickerFrame);
			k++;
			// console.log("###"+JSON.stringify(tickerFrame));
			}		
	}
	if (k==0) callEligibility (tickerFrame);

	
}	

function activeSellOrBuy (order,ticker)
	{
	//console.log("ORDER : "+JSON.stringify(order));
	if (order.side== "sell") 
		{
		var diff = orderThanMarket(order,ticker,"bid");
		if (diff < -5) sellOrder(order);
		else if (ticker.params.ask>order.price)
			{
			//stopScript;
			}
		else if (1)
			{
			checkOrderBookVolume();
			}
		else cancelOrder(order);
		}
	if (order.side== "buy") 
		{
		var diff = orderThanMarket(order,ticker,"ask");
		}
	
	console.log("TICKER : "+JSON.stringify(ticker));
	}

//Actual order compared to the market, higher or lower than a specified X%age.
//orderSide = buy or sell, marketSide= ask or bid, gapSide = positive or negative
function orderThanMarket(order, ticker, marketSide)
	{
	if (marketSide=="bid") var diff = ((ticker.params.bid/order.price)-1)*100;
	if (marketSide=="ask") var diff = ((ticker.params.ask/order.price)-1)*100;
	console.log("DIFF : "+ marketSide+JSON.stringify(diff));
	return diff;
	}

function sellOrder(order){}//console.log("#####"+JSON.stringify(order));
function checkOrderBookVolume(){}//console.log("#####"+JSON.stringify(order));
function cancelOrder(order){}//console.log("#####"+JSON.stringify(order));

function callEligibility (ticker)
	{
	console.log("#####"+JSON.stringify(ticker));
	}

