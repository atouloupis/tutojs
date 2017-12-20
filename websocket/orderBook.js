var mongoDb = require ('./mongoDb');
var mongo = require('mongodb');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
	
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

module.exports.updateOrderBook = updateOrderBook;


function updateOrderBook(orderBookFrame, method,callbackMain)
{
	var dbName = "orderBook";
	var collectionName = "orderBookFrame";
	var symbol = orderBookFrame.symbol;
	// Cr�er la collection
	count(25);
	mongoDb.createCollection(dbName,collectionName,function(){
		//Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
		if (method=="snapshotOrderbook")
		{
			count(31);
			deleteQuery = JSON.parse('{ "symbol" : "'+symbol+'" }');
			mongoDb.deleteRecords(dbName,collectionName,deleteQuery,function(){
				count(36);
				//D�couper la trame pour respecter format
				//D�coupe de ask et enregistrement
				var orderBookAskArray=orderBookFrame.ask;	
				//Appel de la fonction d'ajout des ASK à partir d'un snapshot
				snapshotAddAsk(orderBookAskArray,function(log){
				//D�coupe de bid et enregistrement
				var orderBookBidArray=orderBookFrame.bid;
				console.log(log);
				//Appel de la fonction d'ajout des BID à partir d'un snapshot
				snapshotAddBid(orderBookBidArray,function(){
				sendToWeb();
				callbackMain("FINISH1");
				});	
				});
			});
		}	
		else {
			// R�cup�rer donn�es dans Mongo
			var findSymbolRecords = ['{ "symbol" : "'+symbol+'", "way" : "ask"}','{ "symbol" : "'+symbol+'", "way" : "bid"}'];
			/////////////////////////////Pour les Bid/ask ////////////////
			count(53);
			for (var k=0;k<2;k++)
			{
				// Delete doublons 
				deleteDouble(JSON.parse(findSymbolRecords[k]),function (log){
					count(59);
					console.log(log);
					// insertOrReplace(JSON.parse(findSymbolRecords[k]),function(){
						 if (k==1)
						 {
						// count(63);
						// sendToWeb();
						callbackMain("FINISH2");
						 }
					// });
				});
			}
		}
	});
	
function count(line){
		mongoDb.count(dbName,collectionName,function(count){
			console.log(count+"ligne : "+line);
		});
	}

function snapshotAddAsk(orderBookAskArray,callback) {
	if (orderBookAskArray.length<1) callback("snapshotFinish1");
	for (var counterAsk=0;counterAsk<orderBookAskArray.length || function(){callback("callback comma operator";)}(), false;counterAsk++)
		{
		var askPriceSize=JSON.stringify(orderBookAskArray[counterAsk]);
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "ask", "params" : ' + askPriceSize +' }');;
		count(48);
		console.log("counter beforInsert"+counterAsk);
		mongoDb.insertCollection(dbName,collectionName,objAdd,function(){
		count(50);
		console.log("counter afterInsert"+counterAsk+"oderbookask"+orderBookAskArray.length-1);
		if (counterAsk==orderBookAskArray.length-1)
			{
			count(666);
			callback("snapshotFinish2");
			}
		});
		}
}
function snapshotAddBid(orderBookBidArray,callback) {
	if (orderBookBidArray.length<1) callback();
	for (var i=0;i<orderBookBidArray.length;i++)
		{
		var bidPriceSize=JSON.stringify(orderBookBidArray[i]);
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "bid", "params" : ' + bidPriceSize +' }');
		count(60);
		mongoDb.insertCollection(dbName,collectionName,objAdd,function(){
		count(62);
		if (i==orderBookBidArray.length-1)callback();
		});
		}
}

function deleteDouble(findSymbolRecords,callback){
	count(105);
	mongoDb.findRecords(dbName,collectionName,findSymbolRecords,function(symbolRecords){
		var deleteQuery=[];
		count(107);
		if (symbolRecords.length==0) callback("Lenght = 0"+JSON.stringify(findSymbolRecords));
		for (var i=0;i<symbolRecords.length;i++)
			{
			count(110);
			for (var j=i+1;j<symbolRecords.length;j++)
				{
				count(113);
				if(symbolRecords[i].params.price == symbolRecords[j].params.price)
					{
					count(116);
					 deleteQuery = deletequery.push('{ "symbol" : "'+symbol+'", "_id" : "' + symbolRecords[j]._id + '" }');
					}
				}
			}
			
		for (var i=0;i<deleteQuery.length;i++)
		{
			count(91);
			mongoDb.deleteRecords(dbName,collectionName,JSON.parse(deleteQuery[i]),function(){
			if (i==deleteQuery.length-1)callback("End of loop deleteQuery : " + deleteQuery.length);
			count(94);
			});
		}
	});
}

function insertOrReplace(findSymbolRecords,callback){
	mongoDb.findRecords(dbName,collectionName,findSymbolRecords,function(symbolRecords){
		if (symbolRecords.length<1) callback();
		for (var i=0;i<symbolRecords.length;i++)
		{
			// Chercher si prix existe d�j�	
			if (typeof orderBookFrame.bid[0] != "undefined")
				{
				var orderBookFrameBidPrice=orderBookFrame.bid[0].price;
				var orderBookFrameBidSize=orderBookFrame.bid[0].size;
				if(symbolRecords[i].params.price == orderBookFrame.bid[0].price) 
					{
					// si oui remplacer size
					var newValues = JSON.parse('{ "$set": {"params" : { "size" : '+orderBookFrame.bid[0].size+'}}}');
					var updateQuery = { _id: new mongo.ObjectID(symbolRecords[i]._id)};
					 count(114);
					mongoDb.updateCollection(dbName,collectionName,updateQuery, newValues,function(){
					count(116);
					if (i==symbolRecords.length-1)callback();
					});
					}
				// si non cr�er une nouvelle entr�e
				else 
					{
					var newEntryQuery = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "bid", "params" : { "price" : "'+orderBookFrameBidPrice+'", "size" : "'+orderBookFrameBidSize+'"}}');
					count(125);
					mongoDb.insertCollection(dbName,collectionName,newEntryQuery,function(){
					count(127);
					if (i==symbolRecords.length-1)callback();
					});
					}
				}
				else callback();
			}
		});
}

function sendToWeb(){
	mongoDb.findRecords(dbName,collectionName,"",function(message){
		console.log(message.length);
		var bid = [];
		var ask =[];
		for (var i=0;i<message.length;i++)
		{
			if (message[i].way == "bid")
				{bid.push(message[i].params.price);}
			else 
				{ask.push(message[i].params.price);}
		}
		console.log("BID");
		console.log(bid);
		io.emit('bid message',bid.toString());
		io.emit('ask message', ask.toString());

	});
}

}


