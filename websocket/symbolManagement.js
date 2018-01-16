var api = require('./getRestFull');
var mongoDb = require('./mongoDb');
var schedule = require('node-schedule');
var collectionName = "symbol";
var mongoClient = require('mongodb').MongoClient;
var urlOrderBook = "mongodb://localhost:27017/orderBook";

mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;

    mongoDb.createCollection(collectionName, function() {

        api.getHitBTC("/api/2/public/symbol", "GET", function(err, symbol) {
            if (err) throw err;
            mongoDb.dropCollection(collectionName, function() {
                mongoDb.insertCollection(collectionName, symbol, function() {
                    mongoDb.createIndex(collectionName, "{id:1}", function() {});
                });
            });
        });
        schedule.scheduleJob('*/5 * * * *', function() {
            api.getHitBTC("/api/2/public/symbol", "GET", function(err, symbol) {
                if (err) console.log(err);
                else {
                    mongoDb.dropCollection(collectionName, function() {
                        mongoDb.insertCollection(collectionName, symbol, function() {});
                    });
                }
            });
        });

    });
});