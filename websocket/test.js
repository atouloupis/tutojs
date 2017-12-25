var mongo = require('mongodb');
var mongoDb = require ('./mongoDb');
var dbName = "orderBook";
var collectionName = "orderBookFrame";

//mongoDb.deleteRecords(dbName,collectionName,JSON.parse('{ "symbol" : "BTGETH" }'),function(){});
var objAdd=JSON.parse('{ "symbol" : "BTGETH", "way" : "ask", "params" : {"size":10, "price" : 123456} }')
//mongoDb.insertCollection(dbName,collectionName,objAdd,function(){});
//var updateQuery = { _id: new mongo.ObjectID("5a3814a2e2a0622ed39b8d48")};
//var updateQuery= JSON.parse('{ "_id" :"' + o_id + '"}');
var newValues =JSON.parse('{"$set": {"params" : { "size" : 20}}}');

var findSymbolRecords = ['{ "symbol" : "BTGETH", "way" : "bid"}','{ "symbol" : "BTGETH", "way" : "ask"}'];

for (i=0;i<findSymbolRecords.length;i++)
{
mongoDb.findRecords(dbName,collectionName,JSON.parse(findSymbolRecords[i]),function(message){
console.log(message);});
}


// mongoDb.findRecords(dbName,collectionName,updateQuery,function(message){
// console.log(message);});

//mongoDb.updateCollection(dbName,collectionName,updateQuery, newValues,function(){});



db.orderBookFrame.updateOne({symbol:"IXTETH",way:"ask","params.price":"0.000679"},{$set:{symbol: "IXTETH",way: "ask",params: {price: "0.000679",size: 100}}}


db.orderBookFrame.updateOne({ symbol: 'BCHETH', way: 'ask', 'params.price': '3.895362' },{'$set':{ symbol: 'BCHETH',way: 'ask', params:{ price: '3.895362', size: '0.00' } } })

db.orderBookFrame.aggregate([{ $group: {_id: { firstField: "$price", secondField: "$size" },uniqueIds: { $addToSet: "$_id" },count: { $sum: 1 }}},{ $match: {count: { $gt: 1 }}}])
db.orderBookFrame.aggregate([{ $group: {_id: "$params.price",oderBookFrame: { $push: "$params.size" },count: { $sum: 1 }}},{ $match: {count: { $gt: 1 }}}])
