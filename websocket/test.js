// var mongoDb = require ('./mongoDb');
// var dbName = "orderBook";
// var mongoClient = require('mongodb').MongoClient;
// var urlOrderBook = "mongodb://localhost:27017/orderBook";

//mongoDb.deleteRecords(dbName,collectionName,JSON.parse('{ "symbol" : "BTGETH" }'),function(){});
// var objAdd=JSON.parse('{ "symbol" : "BTGETH", "way" : "ask", "params" : {"size":10, "price" : 123456} }')
//mongoDb.insertCollection(dbName,collectionName,objAdd,function(){});
//var updateQuery = { _id: new mongo.ObjectID("5a3814a2e2a0622ed39b8d48")};
//var updateQuery= JSON.parse('{ "_id" :"' + o_id + '"}');
// var newValues =JSON.parse('{"$set": {"params" : { "size" : 20}}}');
//
// var findSymbolRecords = ['{ "symbol" : "BTGETH", "way" : "bid"}','{ "symbol" : "BTGETH", "way" : "ask"}'];

// for (i=0;i<findSymbolRecords.length;i++)
// {
// mongoDb.findRecords(dbName,collectionName,JSON.parse(findSymbolRecords[i]),function(message){
// console.log(message);});
// }


// mongoDb.findRecords(dbName,collectionName,updateQuery,function(message){
// console.log(message);});

//mongoDb.updateCollection(dbName,collectionName,updateQuery, newValues,function(){});



//db.orderBookFrame.updateOne({symbol:"IXTETH",way:"ask","params.price":"0.000679"},{$set:{symbol: "IXTETH",way: "ask",params: {price: "0.000679",size: 100}}}


// db.orderBookFrame.updateOne({ symbol: 'BCHETH', way: 'ask', 'params.price': '3.895362' },{'$set':{ symbol: 'BCHETH',way: 'ask', params:{ price: '3.895362', size: '0.00' } } })

//db.orderBookFrame.aggregate([{ $group: {_id: { firstField: "$price", secondField: "$size" },uniqueIds: { $addToSet: "$_id" },count: { $sum: 1 }}},{ $match: {count: { $gt: 1 }}}])
//db.orderBookFrame.aggregate([{ $group: {_id: "$params.price",oderBookFrame: { $push: "$params.size" },count: { $sum: 1 }}},{ $match: {count: { $gt: 1 }}}])

// var date = new Date;

// console.log(date.getHours());


// mongoClient.connect(urlOrderBook, function (err, db) {
    // if (err) throw err;
    // var collectionName = "history";
    // var dbOrderBook = db.db("orderBook");

	// dbOrderBook.collection(collectionName).updateOne(

        // { id: 134584767,
            // price: '1.182255',
            // quantity: '0.01',
            // side: 'buy',
            // timestamp: '2018-01-04T18:06:53.824Z',
            // symbol: 'DASHETH' }
        // ,

        // {$set:       { id: 134584767,
                // price: '1.182255',
                // quantity: '0.01',
                // side: 'buy',
                // timestamp: '2018-01-04T18:06:53.824Z',
                // symbol: 'DASHETH' }}




        // ,{upsert:true}, function(err, res) {
        // if (err) throw err;
        // console.log("test");
    // });
	
	// });

 var https = require('https');
getHitBTC(1,2,function(chunk){});
function getHitBTC(path,method,callback) {
    var options = {
        host: "api.hitbtc.com",
        path: "/api/2/trading/balance",
        method: "get",
		ciphers: 'ALL',
		secureProtocol: 'TLSv1_method',
	    headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)'
        },
		
        authorization : 'Basic ' + new Buffer('c400a7328769d4b0582a80365b2d8f98:1b3fde82887787cccf3c56a264a1ee5e').toString('base64')
    };
console.log(options);
    https.request(options, function (res) {
        res.setEncoding('utf8');
        console.log("test");
		res.on('data', function (chunk) {
            callback(chunk);
			console.log(chunk);
        });
    }).end();
}