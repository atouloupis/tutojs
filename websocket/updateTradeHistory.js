module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');
var get = require('./getRestFull')

function newTradeHistory(frame) {
    var date = new Date;
    var collectionName = "tradeHistory";
    mongoDb.createCollection(collectionName, function () {

        if (date.getHours()==0)
        {
            get.getHitBTC("/api/2/history/trades",function(tradesHistory){
                mongoDb.deleteRecords(collectionName,"",function(){
                    mongoDb.insertCollection(collectionName,activeOrder,function (){})
                }) ;
            });
        }
        for (var i = 0; i < frame.length; i++) {
            var queryUpdate = frame[i];
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });



}