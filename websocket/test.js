var mongoDb = require ('./mongoDb');
var dbName = "orderBook";
var collectionName = "orderBookFrame";

mongoDb.deleteRecords(dbName,collectionName,JSON.parse('{ "symbol" : "BTGETH" }'),function(){});
var objAdd=JSON.parse('{ "symbol" : "BTGETH", "way" : "ask", "params" : {"size":10, "price" : 123456} }')
mongoDb.insertCollection(dbName,collectionName,objAdd,function(){});