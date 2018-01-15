module.exports.newActiveOrders = newActiveOrders;
var mongoDb = require('./mongoDb');
var get = require('./getRestFull')
var date1 = new Date;

function newActiveOrders(frame,callback) {
    var date = new Date;
    var collectionName = "activeOrders";
        if (date-date1>60000) {
		date1=new Date;
            get.getHitBTC("/api/2/order", "GET", function (err, activeOrder) {
                if (err) throw err;
                    if (activeOrder.length != 0) {
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
            var queryUpdate = {"clientOrderId": frame[i].clientOrderId};
            var newValue = frame[i];
            mongoDb.updateCollection(collectionName, queryUpdate, {$set: newValue}, function () {
                mongoDb.createIndex(collectionName,"{symbol:1,clientOrderId:1}",function(){
				callback();
				});
            });
        }
        if (frame.length==undefined)
        {
            var queryUpdate = {"clientOrderId": frame.clientOrderId};
            var newValue = frame;
            mongoDb.updateCollection(collectionName, queryUpdate, {$set: newValue}, function () {
                mongoDb.createIndex(collectionName,"{symbol:1,clientOrderId:1}",function(){
				callback();
				});
            });
        }
}