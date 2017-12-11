var mongoDb = require ('./mongoDb');

module.exports.updateOrderBook = updateOrderBook;


function updateOrderBook(orderBookFrame, method)
{
var dbName = "orderBook";
var collectionName = "orderBookFrame";
var symbol = orderBookFrame.symbol;
// Cr�er la collection
mongoDb.createCollection(dbName,collectionName);

//Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
if (method=="snapshotOrderbook")
	{
	//console.log(orderBookFrame.symbol);
	deleteQuery = JSON.parse('{ "symbol" : "'+symbol+'" }');
	//console.log(deleteQuery);
	mongoDb.deleteRecords(dbName,collectionName,deleteQuery);
	//console.log("deleted");
	//D�couper la trame pour respecter format
	//D�coupe de ask et enregistrement
	var orderBookAskArray=orderBookFrame.ask;
	//console.log("Length :" + orderBookAskArray.length);
	for (var i=0;i<orderBookAskArray.length;i++)
		{
		//console.log("i = " + i);
		var askPriceSize=JSON.stringify(orderBookAskArray[i]);
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "ask", "params" : ' + askPriceSize +' }');
		//console.log(objAdd);
		mongoDb.insertCollection(dbName,collectionName,objAdd);
		}
	//D�coupe de bid et enregistrement
	var orderBookBidArray=orderBookFrame.bid;
	for (var i=0;i<orderBookFrame.bid.length;i++)
		{
		// console.log("i = " + i);
		var bidPriceSize=JSON.stringify(orderBookBidArray[i]);
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "bid", "params" : ' + bidPriceSize +' }');
		//console.log(objAdd);
		mongoDb.insertCollection(dbName,collectionName,objAdd);
		}
	}
else {


// R�cup�rer donn�es dans Mongo
	var findSymbolRecords = JSON.parse('[{ "symbol" : "'+symbol+'", "way" : "bid"},{ "symbol" : "'+symbol+'", "way" : "ask"}]');
	console.log("LENGTH :" +findSymbolRecords.length);
	 console.log("LENGTH :" +JSON.stringify(findSymbolRecords[0]));
	 console.log("LENGTH :" +JSON.stringify(findSymbolRecords[1]));
/////////////////////////////Pour les Bid ////////////////
mongoDb.findRecords(dbName,collectionName,JSON.parse('{"symbol" : "IXTETH", "way" : "bid"}'),function(result){
consol.log(result);
});

console.log(symbolRecords);
for (var i=0;i<1;i++)
	{

console.log(findSymbolRecords[i]);
//var symbolRecords=mongoDb.findRecords(dbName,collectionName,findSymbolRecords[i]);

symbolRecords=JSON.parse('[{ "symbol" : "IXTETH", "way" : "bid", "params" : { "price" : "0.0001", "size" : "200"}}]');
// Delete doublons 
	for (var i=0;i<symbolRecords.length;i++)
		{
		for (var j=i+1;j<symbolRecords.length;j++)
			{
			if(symbolRecords[i].params.price == symbolRecords[j].params.price)
				{
				var deleteQuery = '{ "symbol" : "'+symbol+'", "price" : "' + symbolRecords[j]._id + '" }';
				console.log(deleteQuery);
				mongoDb.deleteRecords(dbName,collectionName,deleteQuery);
				}
			}
		// Chercher si prix existe d�j�	
		console.log(orderBookFrame);
		//console.log(symbolRecords[i].params.price);
		console.log("This is the TYPEOF" + typeof orderBookFrame.bid[0]);
		if (typeof orderBookFrame.bid[0] != "undefined")
			{
			var orderBookFrameBidPrice=orderBookFrame.bid[0].price;
			var orderBookFrameBidSize=orderBookFrame.bid[0].size;
			if(symbolRecords[i].params.price == orderBookFrame.bid[0].price) 
				{
				// si oui remplacer size
				var newValues = '{"params" : { "size" : "'+orderBookFrame.params.bid[0].size+'"}}';
				console.log(newValues);
				var updateQuery = '{ "_id" : '+orderBookFrame._id+' }';
				console.log(updateQuery);
				mongoDb.updateCollection(dbName,collectionName,updateQuery, newValues);
				}
			// si non cr�er une nouvelle entr�e
			else 
				{
				var newEntryQuery = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "bid", "params" : { "price" : "'+orderBookFrameBidPrice+'", "size" : "'+orderBookFrameBidSize+'"}}');
				console.log(newEntryQuery);
				mongoDb.insertCollection(dbName,collectionName,newEntryQuery);
				}
			}
		}
		
	}
}	
	
}