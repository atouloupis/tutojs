module.exports.splitFrame = splitFrame;
var updtOrders = require ('./updateActiveOrders');
var checkOrder = require ('./checkOrder');

function splitFrame (jsonFrame){
	// var jsonFrame = JSON.parse(frame);
	console.log("#"+JSON.stringify(jsonFrame));
	if (jsonFrame.method == "ticker")
	{
		console.log(JSON.stringify(jsonFrame.params));
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

};