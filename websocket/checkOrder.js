module.exports.hasAnOrder = hasAnOrder;

function hasAnOrder (tickerFrame) {
	var activeOrders = require('../data/activeOrders.json');
	var k = 0;
	console.log("#"+JSON.stringify(tickerFrame);
	for (var j=0;j<activeOrders.length;j++)
	{
		 console.log("##"+JSON.stringify(activeOrders[j]));
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
	// console.log("####"+JSON.stringify(ticker));
	}
	
function callEligibility (ticker)
	{
	console.log("#####"+JSON.stringify(ticker));
	}