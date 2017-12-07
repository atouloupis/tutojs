var mongoDb = require ('./mongoDb');

module.exports.updateOrderBook = updateOrderBook;

function updateOrderBook(orderBookFrame, method)
{
var dbName = "orderBook";
var collectionName = "orderBookFrame";
// Créer la collection
mongoDb.createMongoCollection(dbName,collectionName);

//Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
if (method=="snapshotOrderbook")
	{
	deleteQuery = '{ "symbol" : "'+orderBookFrame.params.symbol+'" }';
	mongoDb.deleteRecords(dbName,collectionName,deleteQuery);
	//Découper la trame pour respecter format
	//Découpe de ask et enregistrement
	for (var i=0;i<orderbookFrame.ask.lenght;i++)
		{
		var askPriceSize=orderbookFrame.ask[i];
		objAdd = '{ "symbol" : "'+orderBookFrame.params.symbol+'", "way" : "ask", "params" : "' + askPriceSize +'" }'
		insertCollection(dbName,collectionName,objAdd)
		}
	//Découpe de bid et enregistrement
	for (var i=0;i<orderbookFrame.bid.lenght;i++)
		{
		var bidPriceSize=orderbookFrame.bid[i];
		objAdd = '{ "symbol" : "'+orderBookFrame.params.symbol+'", "way" : "bid", "params" : "' + bidPriceSize +'" }'
		insertCollection(dbName,collectionName,objAdd)
		}
	}
else {


// Récupérer données dans Mongo
	var findSymbolRecords[] = ['{ "symbol" : "'+orderBookFrame.params.symbol+'", "way" : "bid"}','{ "symbol" : "'+orderBookFrame.params.symbol+'", "way" : "ask"}'];
	
/////////////////////////////Pour les Bid ////////////////
for (var i=0;i<1;i++)
	{
	
symbolRecords=mongoDb.findRecords(dbName,collectionName,findSymbolRecords[i]);
// Delete doublons 
	for (var i=0;i<symbolRecords.lenght;i++)
		{
		
		for (var j=i+1;j<symbolRecords.lenght;j++)
			{
			if(symbolRecords[i].params.price == symbolRecords[j].params.price)
				{
				deleteQuery = '{ "symbol" : "'+orderBookFrame.params.symbol+'", "price" : "' + symbolRecords[j]._id'" }';
				mongoDb.deleteRecords(dbName,collectionName,deleteQuery);
				}
			}
		// Chercher si prix existe déjà	
		if(symbolRecords[i].params.price == orderBookFrame.params.bid[0].price) 
			{
			// si oui remplacer size
			newValues = '{"params" : { "size" : "'+orderBookFrame.params.bid[0].size+'"}}'
			updateQuery = '{ "_id" : '+orderBookFrame._id+' }';
			mongoDb.updateMongoCollection(dbName,collectionName,updateQuery, newValues);
			}
		// si non créer une nouvelle entrée
		else 
			{
			newEntryQuery = '{ "symbol" : "'+orderBookFrame.params.symbol+'", "way" : "bid", "params" : { "price" : "'+orderBookFrame.params.bid[0].price+'", "size" : "'+orderBookFrame.params.bid[0].size+'"}}'
			mongoDb.insertMongoCollection(dbName,collectionName,newEntryQuery);
			}
		}
		
	}
}	
	
}