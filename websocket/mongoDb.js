module.exports.createMongoDb = createMongoDb;
module.exports.createCollection = createMongoCollection;
module.exports.insertCollection = insertMongoCollection;
module.exports.deleteRecords = deleteMany;
module.exports.findRecords = find;
module.exports.updateCollection = update;
module.exports.count = count;

var mongo = require('mongodb');
var connectDbaseSource = require('./wsClient.js');

function createMongoDb(dbName) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/" + dbName;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.close();
    });
}

function createMongoCollection(dbName, collectionName, callback) {
    var k = 0;
        connectDbaseSource.dbase.listCollections().toArray(function(err, collections) {
            if (err) throw err;
            for (var i = 0; i < collections.length; i++) {
                if (collections[i].name == collectionName) k++;
            }
            if (k == 0) {
                connectDbaseSource.dbase.createCollection(collectionName, function(err, res) {
                    if (err) throw err;
                    console.log("Collection created!");

                    callback();
                });
            } else {

                callback();
            }
        });
}

function insertMongoCollection(dbName, collectionName, myObj, callback) {
        connectDbaseSource.dbase.collection(collectionName).insertOne(myObj, function(err, res) {
            if (err) throw err;
            callback();
        });
}

function deleteMany(dbName, collectioName, query, callback) {
        connectDbaseSource.dbase.collection(collectioName).deleteMany(query, function(err, obj) {
            if (err) throw err;
            callback();
        });

}

function find(dbName, collectionName, query, callback) {
        connectDbaseSource.dbase.collection(collectionName).find(query).sort({
            _id: -1
        }).toArray(function(err, result) {
            if (err) throw err;
            console.log("RESULTA");
            callback(result);
        });
}


function update(dbName, collectionName, query, newValues, callback) {
        connectDbaseSource.dbase.collection(collectionName).updateOne(query, newValues, function(err, res) {
            if (err) throw err;
            callback();
        });
}

function count(dbName, collectionName, callback) {
        connectDbaseSource.dbase.collection(collectionName).count(function(err, res) {
            if (err) throw err;
            callback(res);
        });
}