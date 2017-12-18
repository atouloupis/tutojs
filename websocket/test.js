var mongoDb = require ('./mongoDb');
var dbName = "orderBook";
var collectionName = "orderBookFrame";

mongoDb.deleteRecords(dbName,collectionName,JSON.parse('{ "symbol" : "BTGETH" }'),function(){});