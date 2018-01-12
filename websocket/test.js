var dbName = "heavy";
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/heavy";
var collectionName = "test";


mongoClient.connect(url, function(err, db) {
    if (err) throw err;
	var date2 = new Date;
    var connectDbaseSource = db.db("heavy");
	var myObj=[];
    for (var j = 0; j < 960000; j++) {
	myObj.push({id:j});
	}

	connectDbaseSource.dbase.collection(collectionName).insertMany(myObj, function(err, res) {
        if (err) throw err;
		console.log("Number of documents ="+ res.length)
		var date1 = new Date;
		var time = date1-date2;
		console.log("time ="+time+" ms");

});
// for (var j = 0; j < 960000; j++) {
	    // connectDbaseSource.collection(collectionName).find("").toArray(function(err, result) {
        // if (err) throw err;
		// console.log("Number of documents ="+ result.length)
		// var date1 = new Date;
		// var time = date1-date2;
		// console.log("time ="+time+" ms");
    // });
    // }
});