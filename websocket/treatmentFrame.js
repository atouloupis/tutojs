module.exports.splitFrame = splitFrame;


function splitFrame (frame){
	var jsonFrame = JSON.parse(frame);
console.log("#"+JSON.stringify(jsonFrame));
	if (jsonFrame.method == "ticker")
	{
		//console.log(JSON.stringify(jsonFrame.params));
	}
	if (jsonFrame.method == "activeOrders")
	{
		console.log("###"+JSON.stringify(jsonFrame));
		var foreachframe = jsonFrame.params;
		console.log("####"+JSON.stringify(foreachframe));
		if (foreachframe =! "undefined")
			{
			console.log(JSON.stringify(jsonFrame));
			foreachframe.forEach(function (orders){
				console.log(JSON.stringify(orders.symbol));
				});
			}
	}

};

