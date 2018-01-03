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
                snapshotAddAsk(orderBookFrame.ask, function(log) {
                    //D�coupe de bid et enregistrement
                    console.log("log if = " + log);
                    //Appel de la fonction d'ajout des BID à partir d'un snapshot
                    snapshotAddBid(orderBookFrame.bid, function() {
                        sendToWeb();
                        callbackMain("FINISH1");
                    });
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

    function count(line) {
        mongoDb.count(collectionName, function(count) {
            console.log(count + "ligne : " + line);
        });
    }

    function snapshotAddAsk(orderBookAskArray, callback) {
        if (orderBookAskArray.length < 1) callback("snapshotFinish1");
        var objAdd = [];
        for (var i = 0; i < orderBookAskArray.length; i++) {
            objAdd.push({
                symbol: symbol,
                way: "ask",
                params: orderBookAskArray[i]
            });
        }
        mongoDb.insertCollection(collectionName, objAdd, function() {
            callback("snapshotFinish2");
        });

    }

    function snapshotAddBid(orderBookBidArray, callback) {
        if (orderBookBidArray.length < 1) callback();
        var objAdd = [];
        for (var i = 0; i < orderBookBidArray.length; i++) {
            objAdd.push({
                symbol: symbol,
                way: "bid",
                params: orderBookBidArray[i]
            });
        }
        mongoDb.insertCollection(collectionName, objAdd, function() {
            callback();
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
        mongoDb.findRecords(collectionName, query, function(message) {
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