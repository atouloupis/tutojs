module.exports.createMongoDb = createMongoDb;
module.exports.createMongoCollection = createMongoCollection;
module.exports.insertMongoCollection = insertMongoCollection;
// module.exports.createMongoDb = createMongoDb;

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

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db(dbName);
  dbase.createCollection(collectionName, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
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

// function createMongoDb(name)
// {

// }

// function createMongoDb(name)
// {

// }

// function createMongoDb(name)
// {

// }