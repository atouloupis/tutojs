module.exports.newActiveOrders = newActiveOrders;
var mongoDb = require('./mongoDb');
var get = require('./getRestFull')

function newActiveOrders(frame) {
    var date = new Date;
    var collectionName = "activeOrders";
    mongoDb.createCollection(collectionName, function () {

    if (date.getHours()==0)
    {
        get.getHitBTC("/api/2/order",function(activeOrder){
        mongoDb.deleteRecords(collectionName,"",function(){
            mongoDb.insertCollection(collectionName,activeOrder,function (){})
        }) ;
        });
    }
    //var activeOrders = require('../data/activeOrders.json');
    // console.log(JSON.stringify(activeOrders)); 

        for (var i = 0; i < frame.length; i++) {
            var queryUpdate = frame[i];
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });



}