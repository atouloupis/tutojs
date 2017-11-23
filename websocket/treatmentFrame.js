module.exports.splitFrame = splitFrame;


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
		var foreachframe = jsonFrame.params;
		if (foreachframe != "undefined")
			{
			console.log("##########"+JSON.stringify(foreachframe));
			for (var i=0; i < foreachframe.length; i++){
				console.log("OOOOOO"+JSON.stringify(foreachframe[i].symbol));
				}
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