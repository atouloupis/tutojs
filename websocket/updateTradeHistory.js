module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');
var api = require('./getRestFull')

function newTradeHistory(frame) {
    var date = new Date;
    var collectionName = "tradeHistory";
    mongoDb.createCollection(collectionName, function () {
        if (date.getHours()==0)
        {
            api.getHitBTC("/api/2/history/trades","GET",function(tradesHistory){
                mongoDb.deleteRecords(collectionName,"",function(){
                    mongoDb.insertCollection(collectionName,tradesHistory,function (){})
                });
            });
        }
        for (var i = 0; i < frame.length; i++) {
            var queryUpdate = frame[i];
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });
}