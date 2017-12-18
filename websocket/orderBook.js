var mongoDb = require ('./mongoDb');
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


function updateOrderBook(orderBookFrame, method)
{
var dbName = "orderBook";
var collectionName = "orderBookFrame";
var symbol = orderBookFrame.symbol;
// Cr�er la collection
mongoDb.createCollection(dbName,collectionName,function(){
//console.log(orderBookFrame);
//Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
if (method=="snapshotOrderbook")
	{
	//console.log(orderBookFrame.symbol);
	deleteQuery = JSON.parse('{ "symbol" : "'+symbol+'" }');
	//console.log(deleteQuery);
	mongoDb.deleteRecords(dbName,collectionName,deleteQuery,function(){
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
		mongoDb.insertCollection(dbName,collectionName,objAdd,function(){});
		}
	//D�coupe de bid et enregistrement
	var orderBookBidArray=orderBookFrame.bid;
	for (var i=0;i<orderBookFrame.bid.length;i++)
		{
		// console.log("i = " + i);
		var bidPriceSize=JSON.stringify(orderBookBidArray[i]);
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "bid", "params" : ' + bidPriceSize +' }');
		//console.log(objAdd);
		mongoDb.insertCollection(dbName,collectionName,objAdd,function(){});
		}
	});
	}	
else {


// R�cup�rer donn�es dans Mongo
	var findSymbolRecords = JSON.parse('[{ "symbol" : "'+symbol+'", "way" : "bid"},{ "symbol" : "'+symbol+'", "way" : "ask"}]');
	// console.log("LENGTH :" +findSymbolRecords.length);
	 // console.log("LENGTH :" +JSON.stringify(findSymbolRecords[0]));
	 // console.log("LENGTH :" +JSON.stringify(findSymbolRecords[1]));
/////////////////////////////Pour les Bid ////////////////

for (var i=0;i<1;i++)
	{
	mongoDb.findRecords(dbName,collectionName,findSymbolRecords[i],function(symbolRecords){
		// Delete doublons 
		
		for (var i=0;i<symbolRecords.length;i++)
			{
			for (var j=i+1;j<symbolRecords.length;j++)
				{
				if(symbolRecords[i].params.price == symbolRecords[j].params.price)
					{
					// console.log(symbolRecords[j]);
					// console.log(symbolRecords[i]);
					 var deleteQuery = '{ "symbol" : "'+symbol+'", "_id" : "' + symbolRecords[j]._id + '" }';
					 console.log("doublon delete" + deleteQuery);
					 mongoDb.deleteRecords(dbName,collectionName,JSON.parse(deleteQuery),function(){});
					console.log("DELETED line 84");
					}
				}
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
					var newValues = '{ $set: {params : { size : '+orderBookFrame.bid[0].size+'}}}';
					console.log(newValues);
					var updateQuery = '{ "_id" : "'+symbolRecords[i]._id+'" }';
					console.log("UPDATE QUERY");
					 //console.log(updateQuery);
					mongoDb.updateCollection(dbName,collectionName,JSON.parse(updateQuery), newValues,function(){
					console.log("updated");});
					}
				// si non cr�er une nouvelle entr�e
				else 
					{
					var newEntryQuery = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "bid", "params" : { "price" : "'+orderBookFrameBidPrice+'", "size" : "'+orderBookFrameBidSize+'"}}');
					//console.log("newEntryQuery");
					mongoDb.insertCollection(dbName,collectionName,newEntryQuery,function(){
					console.log("newEntryOK");});
					}
				}
			}
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
		});
	}
}	

});
}