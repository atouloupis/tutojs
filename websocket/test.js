var dbName = "heavy";
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/heavy";
var collectionName = "test";


mongoClient.connect(url, function(err, db) {
    if (err) throw err;
	var date2 = new Date;
    var connectDbaseSource = db.db("heavy");

    for (var j = 0; j < 1; j++) {
	    connectDbaseSource.collection(collectionName).find("").toArray(function(err, result) {
        if (err) throw err;
		console.log("Number of documents ="+ result.length)
		var date1 = new Date;
		console.log(date1);
		console.log(date2);
		var time = date1-date2;
		console.log(time);
		console.log("time ="+date1-date2+" ms");
    });
    }
});