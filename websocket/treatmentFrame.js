module.exports.splitFrame = splitFrame;


function splitFrame (frame){
	var jsonFrame = JSON.parse(frame);

	if (jsonFrame.method = "ticker")
	{
		console.log(jsonFrame.params)
	}
	if (jsonFrame.method = "activeOrders")
	{
		jsonFrame.params.forEach(function (orders){
			console.log(orders.symbol);
		});
	}

};

