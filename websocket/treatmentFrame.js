module.exports.splitFrame = splitFrame;


function splitFrame (frame){
	var jsonFrame = JSON.parse(frame);

	if (jsonFrame.method = "ticker")
	{
		//console.log(JSON.stringify(jsonFrame.params));
	}
	if (jsonFrame.method = "activeOrders")
	{
		var foreachframe = jsonFrame.params
		foreachframe(function (orders){
			console.log(orders.symbol);
		});
	}

};

