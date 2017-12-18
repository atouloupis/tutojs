var mongoDb = require ('./mongoDb');
var dbName = "orderBook";
var collectionName = "orderBookFrame";

//mongoDb.deleteRecords(dbName,collectionName,JSON.parse('{ "symbol" : "BTGETH" }'),function(){});
var objAdd=JSON.parse('{ "symbol" : "BTGETH", "way" : "ask", "params" : {"size":10, "price" : 123456} }')
//mongoDb.insertCollection(dbName,collectionName,objAdd,function(){});
var updateQuery= JSON.parse('{ "_id" : "5a3814a2e2a0622ed39b8d48" }');
var newValues =JSON.parse('{"$set": {"params" : { "size" : 20}}}');

mongoDb.findRecords(dbName,collectionName,updateQuery,function(message){
console.log(message);});

mongoDb.updateCollection(dbName,collectionName,updateQuery, newValues,function(){});