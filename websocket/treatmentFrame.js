module.exports.splitFrame = splitFrame;


function splitFrame (frame){
	var jsonFrame = JSON.parse(frame);

	if (jsonFrame.method = "ticker")
	{
		console.log(JSON.stringify(jsonFrame));
	}
	// if (jsonFrame.method = "activeOrders")
	// {
		// jsonFrame.params.forEach(function (orders){
			// console.log(orders.symbol);
		// });
	// }

};

