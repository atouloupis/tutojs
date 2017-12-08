module.exports.createMongoDb = createMongoDb;
module.exports.createCollection = createMongoCollection;
module.exports.insertCollection = insertMongoCollection;
module.exports.deleteRecords = deleteMany;
module.exports.findRecords = find;
module.exports.updateCollection = update;

var mongo = require('mongodb');

function createMongoDb(dbName)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
}

function createMongoCollection(dbName,collectionName)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;
var k=0;

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbase = db.db(dbName);
	// var collectionList=db.getCollectionNames();
  
dbase.listCollections().toArray(function(err, collections){
    collections=JSON.stringify(collections);
	console.log(collections);
	console.log("collections[i] : "+collections[0]+ "taille tableau" + collections.lenght);
	
	for (var i=0;i<collections.length;i++)if (collections[i]=="collectionName") k++;
});
  console.log("k : "+k);
if (k==0){
  dbase.createCollection(collectionName, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
}
});
}

function insertMongoCollection(dbName,collectionName,myObj)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db(dbName);

dbase.collection(collectionName).insertOne(myObj, function(err, res) {
	if (err) throw err;
	console.log("1 document inserted");
	db.close();
	});
});
}

function deleteMany(dbName,collectioName,query)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db(dbName);

dbase.collection(collectioName).deleteMany(query, function(err, obj) {
  if (err) throw err;
  console.log("documents deleted");
  db.close();
	});
});
}

function find(dbName,collectionName,query)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db(dbName);

dbase.collection(collectionName).sort("{_id : -1}").find(query, function(err, result) {
  if (err) throw err;
  console.log("1 document found");
  db.close();
  return result;
	});
});
}

function update(dbName,collectionName,query, newValues)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db(dbName);
dbase.collection(collectionName).updateOne(query, newValues, function(err, res) {
  if (err) throw err;
  console.log("1 document updated");
  db.close();
	});
});
}

// function createMongoDb(name)
// {

// }

// function createMongoDb(name)
// {

// }