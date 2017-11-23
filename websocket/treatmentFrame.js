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
		if (foreachframe != "undefined")
			{
			console.log("##########"+JSON.stringify(jsonFrame.params));
			for (var i=0;i++; i < jsonFrame.params.length){(function (orders){
				console.log(JSON.stringify(orders.symbol));
				})};
			}
	}

};

  // data = JSON.parse(data); // you missed that...
  // for(var i = 0; i < data.length; i++) {
    // var newPerson = new Person();
    // newPerson.firstname = data[i].firstname;
    // newPerson.lastname = data[i].lastname;
    // newPerson.age = data[i].age;
    // newPerson.save(function (err) {});
  // }