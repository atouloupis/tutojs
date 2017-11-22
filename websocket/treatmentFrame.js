module.exports.splitFrame = splitFrame;


function splitFrame (frame){
	var jsonFrame = JSON.parse(frame);
console.log(JSON.stringify(jsonFrame));
	if (jsonFrame.method = "ticker")
	{
		//console.log(JSON.stringify(jsonFrame.params));
	}
	if (jsonFrame.method = "activeOrders")
	{
		var foreachframe = jsonFrame.params;
		if (foreachframe =! "undefined")
			{
			console.log(JSON.stringify(jsonFrame));
			foreachframe.forEach(function (orders){
				console.log(orders.symbol);
				});
			}
	}

};

