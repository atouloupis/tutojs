module.exports.createCollection = createMongoCollection;
module.exports.insertCollection = insertMongoCollection;
module.exports.deleteRecords = deleteMany;
module.exports.findRecords = find;
module.exports.updateCollection = update;
module.exports.count = count;

var mongo = require('mongodb');
var connectDbaseSource = require('./wsClient.js');

function createMongoCollection(collectionName, callback) {
    var k = 0;
    connectDbaseSource.dbase.listCollections().toArray(function(err, collections) {
        if (err) throw err;
        for (var i = 0; i < collections.length; i++) {
            if (collections[i].name == collectionName) k++;
        }
        if (k == 0) {
                if (err) throw err;
                callback();
        } else {
            callback();
        }
    });
}

function insertMongoCollection(collectionName, myObj, callback) {
    connectDbaseSource.dbase.collection(collectionName).insertMany(myObj, function(err, res) {
        if (err) throw err;
        callback();
    });
}

function deleteMany(collectioName, query, callback) {
    connectDbaseSource.dbase.collection(collectioName).deleteMany(query, function(err, obj) {
        if (err) throw err;
        callback();
    });

}

function find(collectionName, query, callback) {
    connectDbaseSource.dbase.collection(collectionName).find(query).sort({
        _id: -1
    }).toArray(function(err, result) {
        if (err) throw err;
        callback(result);
    });
}


function update(collectionName, query, newValues, callback) {
    connectDbaseSource.dbase.collection(collectionName).updateOne(query, newValues, {upsert:true}, function(err, res) {
        if (err) throw err;
        callback();
    });
}

function count(collectionName, callback) {
    connectDbaseSource.dbase.collection(collectionName).count(function(err, res) {
        if (err) throw err;
        callback(res);
    });
}