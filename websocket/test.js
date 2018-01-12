var dbName = "heavy";
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/heavy";
var collectionName = "test";

var date0 = new Date;



mongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var connectDbaseSource = db.db("heavy");
exports.connectDbaseSource = connectDbaseSource;
    var objAdd = [];

    for (var i = 0; i < 10000; i++) {
        objAdd.push({
            id: i,
            title: "test",
            params: "new params"
        });
    }

    for (var i = 0; i < 100; i++) {
        insertMongoCollection(collectionName, objAdd, function() {});
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
        update(collectionName, updateQuery, newValues, function() {});
        find(collectionName, "", function(message) {});
    }
    if (i = 100) {
        console.log("terminé");
        var date1 = new Date;
        console.log("time =" + (date1 - date0))
    }
});



function insertMongoCollection(collectionName, myObj, callback) {
    connectDbaseSource.dbase.collection(collectionName).insertMany(myObj, function(err, res) {
        if (err) throw err;
        callback();
    });
}

function find(collectionName, query, callback) {
    connectDbaseSource.dbase.collection(collectionName).find(query).toArray(function(err, result) {
        if (err) throw err;
        callback(result);
    });
}

function update(collectionName, query, newValues, callback) {

    connectDbaseSource.dbase.collection(collectionName).updateOne(query, newValues, {
        upsert: true
    }, function(err, res) {
        if (err) throw err;
        callback();
    });
}