module.exports.splitFrame = splitFrame;
var updtOrders = require ('./updateActiveOrders');

function splitFrame (frame){
	var jsonFrame = JSON.parse(frame);
// console.log("#"+JSON.stringify(jsonFrame));
	if (jsonFrame.method == "ticker")
	{
		//console.log(JSON.stringify(jsonFrame.params));
	}
	if (jsonFrame.method == "activeOrders")
	{
		// console.log("###"+JSON.stringify(jsonFrame));
		var activeOrderParams = jsonFrame.params;
		if (activeOrderParams != "undefined")
			{
			console.log("##########"+JSON.stringify(activeOrderParams));
			for (var i=0; i < activeOrderParams.length; i++){
				updtOrders.newActiveOrder(activeOrderParams[i]);
				console.log(JSON.stringify(activeOrderParams[i]));
				}
			}
	}

};