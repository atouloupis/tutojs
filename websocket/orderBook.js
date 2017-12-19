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


function updateOrderBook(orderBookFrame, method,callback)
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
				snapshotAddAsk(orderBookAskArray,function(){});
				//D�coupe de bid et enregistrement
				var orderBookBidArray=orderBookFrame.bid;
				//Appel de la fonction d'ajout des BID à partir d'un snapshot
				snapshotAddBid(orderBookBidArray,function(){});
			});
		}	
		else {
			// R�cup�rer donn�es dans Mongo
			var findSymbolRecords = JSON.parse('[{ "symbol" : "'+symbol+'", "way" : "bid"},{ "symbol" : "'+symbol+'", "way" : "ask"}]');
			/////////////////////////////Pour les Bid/ask ////////////////
			for (var k=0;k<1;k++)
			{
				// Delete doublons 
				deleteDouble(findSymbolRecords[k],function (){
					insertOrReplace(findSymbolRecords[k],function(){});
				});
			}
		}
	});
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
		io.emit('bid message',bid.toString());
		io.emit('ask message', ask.toString());

	});
	function count(line){
		mongoDb.count(dbName,collectionName,function(count){
			console.log(count+"ligne : "+line);
		});
	}

function snapshotAddAsk(orderBookAskArray,callback) {
	for (var i=0;i<orderBookAskArray.length;i++)
		{
		var askPriceSize=JSON.stringify(orderBookAskArray[i]);
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "ask", "params" : ' + askPriceSize +' }');;
		count(48);
		mongoDb.insertCollection(dbName,collectionName,objAdd,function(){
		count(50);
		if (i==orderBookAskArray.length-1)callback();
		});
		}
}
function snapshotAddBid(orderBookBidArray,callback) {
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
	mongoDb.findRecords(dbName,collectionName,findSymbolRecords,function(symbolRecords){
		var deleteQuery=[];
		for (var i=0;i<symbolRecords.length;i++)
			{
			for (var j=i+1;j<symbolRecords.length;j++)
				{
				if(symbolRecords[i].params.price == symbolRecords[j].params.price)
					{
					 deleteQuery = [deletequery,'{ "symbol" : "'+symbol+'", "_id" : "' + symbolRecords[j]._id + '" }'];
					}
				}
			}
		for (var i=0;i<deleteQuery.length;i++)
		{
			count(91);
			mongoDb.deleteRecords(dbName,collectionName,JSON.parse(deleteQuery[i]),function(){
			if (i==deleteQuery.length-1)callback();
			count(94);
			});
		}
	});
}

function insertOrReplace(findSymbolRecords,callback){
	mongoDb.findRecords(dbName,collectionName,findSymbolRecords,function(symbolRecords){
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

}


