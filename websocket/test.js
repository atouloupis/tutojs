var mongoDb = require ('./mongoDb');
var dbName = "orderBook";
var collectionName = "orderBookFrame";

mongoDb.deleteRecords(dbName,collectionName,'{ "symbol" : "BTGETH" }',function(){});