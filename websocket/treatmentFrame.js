module.exports.splitFrame = splitFrame;
var updtOrders = require ('./updateActiveOrders');

function splitFrame (frame){
	var jsonFrame = JSON.parse(frame);
 console.log("#"+JSON.stringify(jsonFrame));
	if (jsonFrame.method == "ticker")
	{
		//console.log(JSON.stringify(jsonFrame.params));
	}
	if (jsonFrame.method == "activeOrders" AND jsonFrame.method == "report")
	{
		// console.log("###"+JSON.stringify(jsonFrame));
		var activeOrderParams = jsonFrame.params;
		if (activeOrderParams != "undefined")
			{
			console.log("##########"+JSON.stringify(activeOrderParams));
			updtOrders.newActiveOrders(activeOrderParams);
			// console.log(JSON.stringify(activeOrderParams[i]));

			}
	}

};