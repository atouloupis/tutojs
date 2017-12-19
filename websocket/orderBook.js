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
//console.log(orderBookFrame);
//Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
if (method=="snapshotOrderbook")
	{
	count(31);
	//console.log(orderBookFrame.symbol);
	deleteQuery = JSON.parse('{ "symbol" : "'+symbol+'" }');
	//console.log(deleteQuery);
	mongoDb.deleteRecords(dbName,collectionName,deleteQuery,function(){
	count(36);
	//console.log("deleted");
	//D�couper la trame pour respecter format
	//D�coupe de ask et enregistrement
	var orderBookAskArray=orderBookFrame.ask;
	//console.log("Length :" + orderBookFrame.ask.length);
	for (var i=0;i<orderBookAskArray.length;i++)
		{
		//console.log("i = " + i);
		var askPriceSize=JSON.stringify(orderBookAskArray[i]);
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "ask", "params" : ' + askPriceSize +' }');
		//console.log(objAdd);
		count(48);
		mongoDb.insertCollection(dbName,collectionName,objAdd,function(){});
		count(50);
		}
	//D�coupe de bid et enregistrement
	var orderBookBidArray=orderBookFrame.bid;
	for (var i=0;i<orderBookFrame.bid.length;i++)
		{
		// console.log("i = " + i);
		var bidPriceSize=JSON.stringify(orderBookBidArray[i]);
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "bid", "params" : ' + bidPriceSize +' }');
		//console.log(objAdd);
		count(60);
		mongoDb.insertCollection(dbName,collectionName,objAdd,function(){
		count(62);
		if (i==orderBookFrame.bid.length-1)callback("terminé");
		});
		}
	});
	}	
else {
// R�cup�rer donn�es dans Mongo
	var findSymbolRecords = JSON.parse('[{ "symbol" : "'+symbol+'", "way" : "bid"},{ "symbol" : "'+symbol+'", "way" : "ask"}]');
	// console.log("LENGTH :" +findSymbolRecords.length);
	 // console.log("LENGTH :" +JSON.stringify(findSymbolRecords[0]));
	 // console.log("LENGTH :" +JSON.stringify(findSymbolRecords[1]));
/////////////////////////////Pour les Bid/ask ////////////////
for (var k=0;k<1;k++)
	{
	mongoDb.findRecords(dbName,collectionName,findSymbolRecords[k],function(symbolRecords){
		// Delete doublons 
		var deleteQuery=[];
		for (var i=0;i<symbolRecords.length;i++)
			{
			for (var j=i+1;j<symbolRecords.length;j++)
				{
				//console.log(symbolRecords[i].params.price+" = "+symbolRecords[j].params.price);
				
				if(symbolRecords[i].params.price == symbolRecords[j].params.price)
					{
					console.log(symbolRecords[i].params.price+" = "+symbolRecords[j].params.price);
					// console.log(symbolRecords[j]);
					// console.log(symbolRecords[i]);
					 deleteQuery = [deletequery,'{ "symbol" : "'+symbol+'", "_id" : "' + symbolRecords[j]._id + '" }'];
					 //console.log("doublon delete" + deleteQuery);
					}
				}
			}
		for (var i=0;i<deleteQuery.length;i++)
		{
			count(91);
			mongoDb.deleteRecords(dbName,collectionName,JSON.parse(deleteQuery[i]),function(){
			//console.log("DELETED line 84");
			count(94);
			});
		}
	
	mongoDb.findRecords(dbName,collectionName,findSymbolRecords[k],function(symbolRecords){
		for (var i=0;i<symbolRecords.length;i++)
		{
			// Chercher si prix existe d�j�	
			//console.log(orderBookFrame);
			//console.log(symbolRecords[i].params.price);
			// console.log("This is the TYPEOF" + typeof orderBookFrame.bid[0]);
			if (typeof orderBookFrame.bid[0] != "undefined")
				{
				var orderBookFrameBidPrice=orderBookFrame.bid[0].price;
				var orderBookFrameBidSize=orderBookFrame.bid[0].size;
				if(symbolRecords[i].params.price == orderBookFrame.bid[0].price) 
					{
					// si oui remplacer size
					var newValues = JSON.parse('{ "$set": {"params" : { "size" : '+orderBookFrame.bid[0].size+'}}}');
					//console.log(newValues);
					var updateQuery = { _id: new mongo.ObjectID(symbolRecords[i]._id)};
					//console.log("UPDATE QUERY");
					 //console.log(updateQuery);
					 count(114);
					mongoDb.updateCollection(dbName,collectionName,updateQuery, newValues,function(){
					count(116);
					callback("terminé");
					//console.log("updated");
					});
					}
				// si non cr�er une nouvelle entr�e
				else 
					{
					var newEntryQuery = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "bid", "params" : { "price" : "'+orderBookFrameBidPrice+'", "size" : "'+orderBookFrameBidSize+'"}}');
					//console.log("newEntryQuery");
					count(125);
					mongoDb.insertCollection(dbName,collectionName,newEntryQuery,function(){
					count(127);
					callback("terminé");
					//console.log("newEntryOK");
					});
					}
				}
				else callback("terminé");
			}
		});
		});
	}

	}
	

});
mongoDb.findRecords(dbName,collectionName,"",function(message){
	console.log(message.length);
	var bid = [];
	var ask =[];
	//message = JSON.stringify(message);
	for (var i=0;i<message.length;i++)
	{
		if (message[i].way == "bid")
		{bid.push(message[i].params.price);}
		else 
		{ask.push(message[i].params.price);}
	}
	//console.log(bid);
	io.emit('bid message',bid.toString());
	io.emit('ask message', ask.toString());
		//socket.broadcast.emit('message',message);

});
function count(line){

mongoDb.count(dbName,collectionName,function(count){
	console.log(count+"ligne : "+line);
	});
}
}


