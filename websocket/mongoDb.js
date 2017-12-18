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

function createMongoCollection(dbName,collectionName,callback)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;
var k=0;

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbase = db.db(dbName);

dbase.listCollections().toArray(function(err, collections){
	if (err) throw err;
	//console.log("Collection name "+collections.length);
    //console.log("Collection name  "+collectionName);
	for (var i=0;i<collections.length;i++)
		{//console.log("Collection name  "+collections[i].name);
		if (collections[i].name==collectionName) k++;
		//console.log("Collection name K "+k);
		}

  //console.log("k : "+k);
if (k==0){
  dbase.createCollection(collectionName, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");

  });
}
db.close();
callback();   
});
});
}

function insertMongoCollection(dbName,collectionName,myObj,callback)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db(dbName);

dbase.collection(collectionName).insertOne(myObj, function(err, res) {
	if (err) throw err;
	//console.log("1 document inserted");
	db.close();
	callback();
	});
});

}

function deleteMany(dbName,collectioName,query,callback)
{
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db(dbName);

dbase.collection(collectioName).deleteMany(query, function(err, obj) {
  if (err) throw err;
  console.log("documents deleted");
   callback();
	});
 db.close();
});

}

function find(dbName,collectionName,query,callback)
{

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"+dbName;
//console.log("ENTER FIND : "+dbName+collectionName);
MongoClient.connect(url, function(err, db) {
//  console.log("INSIDE FIND : "+err);
//  console.log(db);
  if (err) throw err;
  var dbase = db.db(dbName);
//console.log("TRY REQUEST FIND");
dbase.collection(collectionName).find(query).sort({_id:-1}).toArray(function(err, result) {
	//console.log(err);
  if (err) throw err;
  //console.log("1 document found");
  //console.log(result);
 callback (result);
	});
  db.close();
});
}

function update(dbName,collectionName,query, newValues,callback)
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
  callback();
	});
  
});
}

// function createMongoDb(name)
// {

// }

// function createMongoDb(name)
// {

// }