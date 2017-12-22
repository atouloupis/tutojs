var mongoDb = require('./mongoDb');
var mongo = require('mongodb');
var ioSource = require('./wsClient.js');
module.exports.updateOrderBook = updateOrderBook;


function updateOrderBook(orderBookFrame, method, callbackMain) {
    var collectionName = "orderBookFrame";
    var symbol = orderBookFrame.symbol;
    // Cr�er la collection
    count(11);
    mongoDb.createCollection(collectionName, function() {
        //Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
        if (method == "snapshotOrderbook") {
            count(15);
            deleteQuery = JSON.parse('{ "symbol" : "' + symbol + '" }');
            mongoDb.deleteRecords(collectionName, deleteQuery, function() {
                count(18);
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
            var findSymbolRecords = ['{ "symbol" : "' + symbol + '", "way" : "ask"}', '{ "symbol" : "' + symbol + '", "way" : "bid"}'];
            /////////////////////////////Pour les Bid/ask ////////////////
            count(38);
            for (var k = 0; k < 2; k++) {
                // Delete doublons 
                // deleteDouble(JSON.parse(findSymbolRecords[k]), function(log) {
                    count(42);
                    console.log("log else = " + log);
                    insertOrReplace(JSON.parse(findSymbolRecords[k]),function(){
                    if (k == 1) {
                        count(63);
                        sendToWeb();
                        callbackMain("FINISH2");
                    }
                    // });
                });
            // }
        }
    });

    function count(line) {
        mongoDb.count(collectionName, function(count) {
            console.log(count + "ligne : " + line);
        });
    }

    function snapshotAddAsk(orderBookAskArray, callback) {
        if (orderBookAskArray.length < 1) callback("snapshotFinish1");
        var objAdd=[];
		for (var i = 0; i < orderBookAskArray.length; i++) {
				objAdd.push({
				symbol:symbol,
				way:"ask",
				params:orderBookAskArray[i]
				});
        }				
        count(72);

        mongoDb.insertCollection(collectionName, objAdd, function() {
            count(75);
            callback("snapshotFinish2");
            });

    }

    function snapshotAddBid(orderBookBidArray, callback) {
        if (orderBookBidArray.length < 1) callback();
		var objAdd=[];
        for (var i = 0; i < orderBookBidArray.length; i++) {
				objAdd.push({
				symbol:symbol,
				way:"bid",
				params:orderBookBidArray[i]
				});
        }		
            count(91);
            mongoDb.insertCollection(collectionName, objAdd, function() {
                count(93);
                callback();
            });
    }

    function deleteDouble(findSymbolRecords, callback) {
        count(99);
        mongoDb.findRecords(collectionName, findSymbolRecords, function(symbolRecords) {
            var deleteQuery = [];
            count(102);
            if (symbolRecords.length == 0) callback("Lenght = 0" + JSON.stringify(findSymbolRecords));
            for (var i = 0; i < symbolRecords.length; i++) {
                count(105);
                for (var j = i + 1; j < symbolRecords.length; j++) {
                    if (symbolRecords[i].params.price == symbolRecords[j].params.price) {
                        count(109);
                        deleteQuery = deletequery.push('{ "symbol" : "' + symbol + '", "_id" : "' + symbolRecords[j]._id + '" }');
                    }
                }
            }

            for (var i = 0; i < deleteQuery.length; i++) {
                count(116);
                mongoDb.deleteRecords(collectionName, JSON.parse(deleteQuery[i]), function() {
                    if (i == deleteQuery.length - 1) callback("End of loop deleteQuery : " + deleteQuery.length);
                    count(119);
                });
            }
        });
    }

    function insertOrReplace(findSymbolRecords, callback) {
        mongoDb.findRecords(collectionName, findSymbolRecords, function(symbolRecords) {
            if (symbolRecords.length < 1) callback();
            for (var i = 0; i < symbolRecords.length; i++) {
                // Chercher si prix existe d�j�	
                if (typeof orderBookFrame.bid[0] != "undefined") {
                    if (symbolRecords[i].params.price == orderBookFrame.bid[0].price) {
                        // si oui remplacer size
						
                        var newValues = JSON.parse('{ "$set": {"params" : { "size" : ' + orderBookFrame.bid[0].size + '}}}');
                        var updateQuery = {
                            _id: new mongo.ObjectID(symbolRecords[i]._id)
                        };
                        count(140);
                        mongoDb.updateCollection(collectionName, updateQuery, newValues, function() {
                            count(142);
                            if (i == symbolRecords.length - 1) callback();
                        });
                    }
                    // si non cr�er une nouvelle entr�e
                    else {
                        var newEntryQuery = { 
						symbol:symbol,
						way : "bid", 
						params : 
							{ 
							price : orderBookFrame.bid[0].price, 
							size : orderBookFrame.bid[0].size,
							}
						};
						var updateQuery = {
						params :
							{
							price : orderBookFrame.bid[0].price
							}
						};
						
                        count(160);
                        mongoDb.updateCollection(collectionName, updateQuery, newEntryQuery, function() {
                            count(162);
                            if (i == symbolRecords.length - 1) callback();
                        });
                    }
                } else callback();
            }
        });
    }

    function sendToWeb() {
        mongoDb.findRecords(collectionName, "", function(message) {
            var bid = [];
            var ask = [];
            for (var i = 0; i < message.length; i++) {
                if (message[i].way == "bid") {
                    bid.push(message[i].params.price);
                } else {
                    ask.push(message[i].params.price);
                }
            }
            ioSource.io.emit('bid message', bid.toString());
            ioSource.io.emit('ask message', ask.toString());

        });
    }

}