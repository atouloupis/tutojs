var mongoDb = require ('./mongoDb');

module.exports.updateOrderBook = updateOrderBook;


function updateOrderBook(orderBookFrame, method)
{
var dbName = "orderBook";
var collectionName = "orderBookFrame";
// Cr�er la collection
mongoDb.createCollection(dbName,collectionName);

//Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
if (method=="snapshotOrderbook")
	{
	//console.log(orderBookFrame.symbol);
	deleteQuery = JSON.parse('{ "symbol" : "'+orderBookFrame.symbol+'" }');
	console.log(deleteQuery);
	mongoDb.deleteRecords(dbName,collectionName,deleteQuery);
	console.log("deleted");
	//D�couper la trame pour respecter format
	//D�coupe de ask et enregistrement
	var orderBookAskArray=JSON.stringify(orderBookFrame.ask);
	console.log("Length :" + orderBookAskArray.length);
	for (var i=0;i<orderBookAskArray.length;i++)
		{
		console.log("i = " + i);
		var askPriceSize=orderBookAskArray[i];
		console.log(orderBookAskArray[0]);
		console.log(orderBookAskArray[1]);
		console.log(orderBookAskArray[2]);
		var symbol = orderBookFrame.symbol;
		var objAdd = JSON.parse('{ "symbol" : "'+symbol+'", "way" : "ask", "params" : "' + askPriceSize +'" }');
		console.log(objAdd);
		insertCollection(dbName,collectionName,objAdd);
		}
	//D�coupe de bid et enregistrement
	for (var i=0;i<orderBookFrame.bid.length;i++)
		{
		var bidPriceSize=orderbookFrame.bid[i];
		var objAdd = '{ "symbol" : "'+orderBookFrame.symbol+'", "way" : "bid", "params" : "' + bidPriceSize +'" }';
		insertCollection(dbName,collectionName,objAdd);
		}
	}
else {


// R�cup�rer donn�es dans Mongo
	var findSymbolRecords = ['{ "symbol" : "'+orderBookFrame.symbol+'", "way" : "bid"}','{ "symbol" : "'+orderBookFrame.params.symbol+'", "way" : "ask"}'];
	
/////////////////////////////Pour les Bid ////////////////
for (var i=0;i<1;i++)
	{
	
var symbolRecords=mongoDb.findRecords(dbName,collectionName,findSymbolRecords[i]);
// Delete doublons 
	for (var i=0;i<symbolRecords.length;i++)
		{
		
		for (var j=i+1;j<symbolRecords.length;j++)
			{
			if(symbolRecords[i].params.price == symbolRecords[j].params.price)
				{
				var deleteQuery = '{ "symbol" : "'+orderBookFrame.symbol+'", "price" : "' + symbolRecords[j]._id + '" }';
				mongoDb.deleteRecords(dbName,collectionName,deleteQuery);
				}
			}
		// Chercher si prix existe d�j�	
		if(symbolRecords[i].params.price == orderBookFrame.params.bid[0].price) 
			{
			// si oui remplacer size
			var newValues = '{"params" : { "size" : "'+orderBookFrame.params.bid[0].size+'"}}'
			var updateQuery = '{ "_id" : '+orderBookFrame._id+' }';
			mongoDb.updateCollection(dbName,collectionName,updateQuery, newValues);
			}
		// si non cr�er une nouvelle entr�e
		else 
			{
			var newEntryQuery = '{ "symbol" : "'+orderBookFrame.symbol+'", "way" : "bid", "params" : { "price" : "'+orderBookFrame.params.bid[0].price+'", "size" : "'+orderBookFrame.params.bid[0].size+'"}}'
			mongoDb.insertMongoCollection(dbName,collectionName,newEntryQuery);
			}
		}
		
	}
}	
	
}