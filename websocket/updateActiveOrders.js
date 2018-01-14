module.exports.newActiveOrders = newActiveOrders;
var mongoDb = require('./mongoDb');
var get = require('./getRestFull')

function newActiveOrders(frame) {
    var date = new Date;
    var collectionName = "activeOrders";
        if (date.getSeconds() == 1) {
            get.getHitBTC("/api/2/order", "GET", function (err, activeOrder) {
                if (err) throw err;
                    if (frame.length != 0) {
                        console.log("newOrder")
                        mongoDb.dropCollection(collectionName, function () {
                            mongoDb.insertCollection(collectionName, activeOrder, function () {
                                mongoDb.createIndex(collectionName, "{symbol:1}", function () {
                                });
                            });
                        });
                    }
            });
        }

        for (var i = 0; i < frame.length; i++) {
            console.log("AHHHHHHHH")
            var queryUpdate = {"clientOrderId": frame[i].clientOrderId};
            var newValue = frame[i];
            mongoDb.updateCollection(collectionName, queryUpdate, {$set: newValue}, function () {
                mongoDb.createIndex(collectionName,"{symbol:1,clientOrderId:1}",function(){});
            });
        }
        if (frame.length==undefined)
        {
            var queryUpdate = {"clientOrderId": frame.clientOrderId};
            var newValue = frame;
            mongoDb.updateCollection(collectionName, queryUpdate, {$set: newValue}, function () {
                mongoDb.createIndex(collectionName,"{symbol:1,clientOrderId:1}",function(){});
            });
        }
}