module.exports.splitFrame = splitFrame;


function splitFrame (frame){
console.log("#"+JSON.stringify(frame));
	var jsonFrame = JSON.parse(frame);
console.log("##"+JSON.stringify(jsonFrame));
	if (jsonFrame.method = "ticker")
	{
		//console.log(JSON.stringify(jsonFrame.params));
	}
	if (jsonFrame.method = "activeOrders")
	{
		//console.log("###"+JSON.stringify(jsonFrame));
		var foreachframe = jsonFrame.params;
		//console.log("####"+JSON.stringify(foreachframe));
		if (foreachframe =! "undefined")
			{
			console.log(JSON.stringify(jsonFrame));
			foreachframe.forEach(function (orders){
				//console.log(orders.symbol);
				});
			}
	}

};

