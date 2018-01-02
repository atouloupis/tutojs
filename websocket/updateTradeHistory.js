module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');
var api = require('./getRestFull')

function newTradeHistory(frame) {
    var date = new Date;
    var collectionName = "tradeHistory";
	var tradesTable[];
    mongoDb.createCollection(collectionName, function () {
        if (date.getHours()==0)
        {
            api.getHitBTC("/api/2/history/trades","GET",function(tradesHistory){
                tradesTable=tradesHistory.params.data;
				mongoDb.deleteRecords(collectionName,"",function(){
				for (var i = 0; i<tradesTable.length;i++) {
                    mongoDb.insertCollection(collectionName,{tradesTable[i],"symbol":tradesHistory.params.symbol},function (){});
					}
				});
			});
        }
        for (var i = 0; i < frame.params.data.length; i++) {
            var queryUpdate = {frame.params.data[i],"symbol":frame.params.symbol};
            mongoDb.updateCollection(collectionName, queryUpdate, queryUpdate, function () {
            });
        }
    });
}