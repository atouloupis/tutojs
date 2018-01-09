var mongoDb = require('./mongoDb');
var ioSource = require('./wsClient.js');
module.exports.updateOrderBook = updateOrderBook;


function updateOrderBook(orderBookFrame, method, callbackMain) {
    var collectionName = "orderBookFrame";
    var symbol = orderBookFrame.symbol;
    // Cr�er la collection

    mongoDb.createCollection(collectionName, function() {
        //Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
        if (method == "snapshotOrderbook") {
            deleteQuery = JSON.parse('{ "symbol" : "' + symbol + '" }');
            mongoDb.deleteRecords(collectionName, deleteQuery, function() {
                //D�couper la trame pour respecter format
                //D�coupe de ask et enregistrement
                //Appel de la fonction d'ajout des ASK à partir d'un snapshot
                snapshotAddAsk(orderBookFrame, function() {
                    //D�coupe de bid et enregistrement
					sendToWeb();
                    callbackMain("FINISH1");
					});
            });
        } else {
            // R�cup�rer donn�es dans Mongo

            /////////////////////////////Pour les Bid/ask ////////////////
            insertOrReplace(orderBookFrame, function() {
                sendToWeb();
                callbackMain("FINISH2");
            });
        }
    });

    function snapshotAddAsk(orderBookFrame, callback) {
        if (orderBookFrame.ask.length < 1 || orderBookFrame.bid.length <1) callback("snapshotFinish1");
        var objAdd = [];
		
        for (var i = 0; i < orderBookFrame.ask.length; i++) {
			objAdd.push({
                symbol: symbol,
                way: "ask",
                params: orderBookFrame.ask[i]
            });
        }
		for (var i = 0; i < orderBookFrame.bid.length; i++) {
            objAdd.push({
                symbol: symbol,
                way: "bid",
                params: orderBookFrame.bid[i]
            });
        }
        mongoDb.insertCollection(collectionName, objAdd, function() {
            callback("snapshotFinish2");
        });

    }

    function insertOrReplace(orderBookFrame, callback) {

        if (typeof orderBookFrame.bid[0] != "undefined") {
            var queryBid = {symbol: symbol,way: "bid","params.price": orderBookFrame.bid[0].price};

            var newEntryBid = { $set:{symbol: symbol,way: "bid",params: {price: orderBookFrame.bid[0].price,size: orderBookFrame.bid[0].size}}};
            mongoDb.updateCollection(collectionName, queryBid, newEntryBid, function() {
            });
        }

        if (typeof orderBookFrame.ask[0] != "undefined") {
            var queryAsk = {symbol: symbol,way: "ask","params.price": orderBookFrame.ask[0].price};
            var newEntryAsk = {$set:{symbol: symbol,way: "ask",params: {price: orderBookFrame.ask[0].price,size: orderBookFrame.ask[0].size}}};
            mongoDb.updateCollection(collectionName, queryAsk, newEntryAsk, function() {
            });

        }
        callback();
    }

    function sendToWeb() {
        var query={symbol:symbol};
        mongoDb.findRecords(collectionName, query,{_id: -1}, function(message) {
            var bid = [];
            var ask = [];
            for (var i = 0; i < message.length; i++) {

                if (message[i].way == "bid") {
                    if (message[i].params.size!=0)bid.push(message[i].params.price);
                } else {
                    if (message[i].params.size!=0)ask.push(message[i].params.price);
                }
            }
            ioSource.io.emit('bid message', bid);
            ioSource.io.emit('ask message', ask);
        });
    }

}