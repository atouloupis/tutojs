module.exports.newActiveOrders = newActiveOrders;
var mongoDb = require('./mongoDb');
var get = require('./getRestFull')

function newActiveOrders(frame) {
    var date = new Date;
    var collectionName = "activeOrders";
        if (date.getSeconds() == 1) {
            get.getHitBTC("/api/2/order", "GET", function (err, activeOrder) {
                if (err) throw err;
                mongoDb.deleteRecords(collectionName, {}, function () {
                    if (frame.length != 0)mongoDb.insertCollection(collectionName, activeOrder, function () {});
                });
            });
        }

        for (var i = 0; i < frame.length; i++) {
            var queryUpdate = {"clientOrderId": frame[i].clientOrderId};
            var newValue = frame[i];
            mongoDb.updateCollection(collectionName, queryUpdate, {$set: newValue}, function () {
            });
        }
        if (frame.length == 0) mongoDb.deleteRecords(collectionName, {}, function () {
        });
}