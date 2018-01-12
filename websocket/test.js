var dbName = "heavy";
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/heavy";
var collectionName = "test";

var date0 = new Date;



mongoClient.connect(url, function(err, db) {
    if (err) throw err;
	var date2 = new Date;
    var connectDbaseSource = db.db("heavy");
    var objAdd = [];

    for (var i = 0; i < 10000; i++) {
        objAdd.push({
            id: i,
            title: "test",
            params: "new params"
        });
    }

    for (var i = 0; i < 100; i++) {
        insertMongoCollection(connectDbaseSource,collectionName, objAdd, function() {var date3 = new Date;});
}

for (var i = 0; i < 100; i++) {
        var updateQuery = {
            id: i
        };
        var newValues = {
            $set: {
                params: {
                    "size": 1
                }
            }
        };
        update(connectDbaseSource,collectionName, updateQuery, newValues, function() {var date4 = new Date;});
}
for (var i = 0; i < 100; i++) {
        find(connectDbaseSource,collectionName, {id:0}, function(message) {});
    }
    if (i = 100) {
        console.log("terminé");
        var date1 = new Date;
        console.log("time =" + (date1 - date0));
		console.log("time1 =" + (date1 - date2));
		console.log("time2 =" + (date1 - date3));
		console.log("time3 =" + (date1 - date4));
    }
});



function insertMongoCollection(connectDbaseSource,collectionName, myObj, callback) {
    connectDbaseSource.collection(collectionName).insertMany(myObj, function(err, res) {
        if (err) throw err;
        callback();
    });
}

function find(connectDbaseSource,collectionName, query, callback) {
    connectDbaseSource.collection(collectionName).find(query).toArray(function(err, result) {
        if (err) throw err;
        callback(result);
    });
}

function update(connectDbaseSource,collectionName, query, newValues, callback) {

    connectDbaseSource.collection(collectionName).updateOne(query, newValues, {
        upsert: true
    }, function(err, res) {
        if (err) throw err;
        callback();
    });
}