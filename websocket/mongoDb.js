module.exports.insertCollection = insertMongoCollection;
module.exports.deleteRecords = deleteMany;
module.exports.findRecords = find;
module.exports.updateCollection = update;
module.exports.dropCollection=drop;
module.exports.count = count;
module.exports.createIndex = createIndex;
module.exports.createCollection = createCollection;

var connectDbaseSource = require('./wsClient.js');
//var connectDbaseSource = require('./test.js');

function createCollection (collectionName,callback) {
    connectDbaseSource.dbase.createCollection(collectionName, function (err, res) {
        if (err) throw err;
        callback(res);
    });
}

function insertMongoCollection(collectionName, myObj, callback) {
	connectDbaseSource.dbase.collection(collectionName).insertMany(myObj, function(err, res) {
        if (err) throw err;
        callback(res);
    });
}

function deleteMany(collectioName, query, callback) {
    connectDbaseSource.dbase.collection(collectioName).deleteMany(query, function(err, obj) {
        if (err) throw err;
        callback(obj);
    });

}

function find(collectionName, query, sort, callback) {
	connectDbaseSource.dbase.collection(collectionName).find(query).sort(sort).toArray(function(err, result) {
        if (err) throw err;
        callback(result);
    });
}


function update(collectionName, query, newValues, callback) {
	
	connectDbaseSource.dbase.collection(collectionName).updateOne(query, newValues, {upsert:true}, function(err, res) {
        if (err) throw err;
        callback(res);
    });
}

function drop(collectionName, callback) {
    connectDbaseSource.dbase.dropCollection(collectionName, function(err) {
        if (err) throw err;
        console.log("drop collection name");
        console.log(collectionName);
        callback();
    });
}

function count(collectionName, callback) {
    connectDbaseSource.dbase.collection(collectionName).count(function(err, res) {
        if (err) throw err;
        callback(res);
    });
}

function createIndex(collectionName,index, callback){
    connectDbaseSource.dbase.collection(collectionName).ensureIndex(index,function(err,res){
        if (err) throw err;
        callback(res);
    });
}