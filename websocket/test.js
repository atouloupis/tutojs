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

function getHitBTC(path,method,callback) {
    var options = {
        host: "api.hitbtc.com",
        path: "/api/2/trading/balance",
        method: "get",
	    headers: {
            'Accept': 'application/json',
			'Authorization' : 'Basic ' + new Buffer('c400a7328769d4b0582a80365b2d8f98:1b3fde82887787cccf3c56a264a1ee5e').toString('base64')
		}    
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
getHitBTC(1,2,function(chunk){});

var https = require('https');
var querystring = require('querystring');
var crypto = require('crypto');
var _ = require('underscore');

function HitBTCClient (APIKey, APISecret, APIType) {
    this.APIKey = APIKey;
    this.APISecret = APISecret;
    this.APIType = APIType || 'sandbox';
    this.APIVersion = '2';
};

HitBTCClient.HOSTS = {
    live: 'api.hitbtc.com',
    sandbox: 'demo-api.hitbtc.com'
};

HitBTCClient.prototype._get = function (endpoint, destination, params, callback) {
    var options = {
        host: HitBTCClient.HOSTS[this.APIType],
        path: '/api/' + this.APIVersion + '/' + destination + '/' + endpoint,
        method: 'get',
        headers: {
            //'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
			'Accept': 'application/json'
        }
		
    };
console.log(options);
    if (destination !== 'public') {
        this._authorize('get', options, params);
    }
    else if (Object.keys(params).length) {
        options.path = options.path + '?' + querystring.stringify(params);
    }

    var req = https.request(options, function (res) {
        console.log(options);
		res.setEncoding('utf8');
        var buffer = '';
        res.on('data', function (data) {
            buffer += data;
        });
        res.on('end', function () {
            try {
			
                var json = JSON.parse(buffer);
            } catch (err) {
                return callback(err);
            }
            callback(null, json);
        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function() {
          req.abort();
        });
    });

    req.end();
};

HitBTCClient.prototype._post = function (endpoint, destination, params, callback) {
    var options = {
        host: HitBTCClient.HOSTS[this.APIType],
        path: '/api/' + this.APIVersion + '/' + destination + '/' + endpoint,
        method: 'post',
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
        }
    };

    this._authorize('post', options, params);

    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        var buffer = '';
        res.on('data', function (data) {
            buffer += data;
        });
        res.on('end', function () {
            try {
                var json = JSON.parse(buffer);
            } catch (err) {
                return callback(err);
            }
            callback(null, json);
        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function() {
          req.abort();
        });
    });
    
    req.end(querystring.stringify(params));
};

HitBTCClient.prototype._authorize = function (requestType, options, params) {
    var authParams = { 
        nonce: Date.now(),
        apikey: this.APIKey
    };

    var message;

    if (requestType === 'get') {
        options.path = options.path + '?' + querystring.stringify(_.extend({}, authParams, params));

        message = options.path;
    }
    else {
        options.path = options.path + '?' + querystring.stringify(authParams);

        message = options.path + querystring.stringify(params);
    }
console.log(crypto.createHmac('sha512', this.APISecret).update(message).digest('hex'));
    options.headers['X-Signature'] = crypto.createHmac('sha512', this.APISecret).update(message).digest('hex');
};

/*
 * Public API Methods
 */

HitBTCClient.prototype.time = function (callback) {
    this._get('time', 'public', {}, callback);
};

HitBTCClient.prototype.pairs = function (callback) {
    this._get('pairs', 'public', {}, callback);
};

HitBTCClient.prototype.ticker = function (pair, callback) {
    this._get('ticker/'+pair, 'public', {}, callback);
};

HitBTCClient.prototype.orderbook = function (pair, callback) {
    this._get('orderbook/'+pair , 'public', {}, callback);
};

HitBTCClient.prototype.trades = function () {
    throw new Error('Not Implemented');
};

/*
 * Trading API Methods
 */

HitBTCClient.prototype.tradingBalance = function (callback) {
    this._get('balance', 'trading', {}, callback);
};

HitBTCClient.prototype.activeOrders = function (pairs, callback) {
    this._get('orders/active', 'trading', { symbols: pairs }, callback);
};

HitBTCClient.prototype.newOrder = function (clientOrderId, pair, side, price, quantity, type, timeInForce, callback) {
    var obj = { clientOrderId: clientOrderId, symbol: pair, side: side, quantity: quantity, type: type, timeInForce: timeInForce };

    if (type !== 'market') {
        obj['price'] = price;
    }

    this._post('new_order', 'trading', obj, callback);
};

HitBTCClient.prototype.cancelOrder = function (clientOrderId, cancelRequestClientOrderId, pair, side, callback) {
    throw new Error('Not Implemented');
};

HitBTCClient.prototype.trades = function (by, start_index, max_results, symbols, sort, from, till, callback) {
    throw new Error('Not Implemented');
};

HitBTCClient.prototype.recentOrders = function  (start_index, max_results, symbols, statuses, callback) {
    throw new Error('Not Implemented');
};

/*
 * Payment API Methods
 */

HitBTCClient.prototype.paymentBalance = function (callback) {
    this._get('balance', 'payment', {}, callback);
};

HitBTCClient.prototype.transferToTrading = function (amount, currency_code, callback) {
    throw new Error('Not Implemented');
};

HitBTCClient.prototype.transferToMain = function (amount, currency_code, callback) {
    throw new Error('Not Implemented');
};

HitBTCClient.prototype.getPaymentAddress = function (currency_code, callback) {
    this._get('address/' + currency_code, 'payment', {}, callback);
};

HitBTCClient.prototype.createPaymentAddress = function (currency_code, callback) {
    throw new Error('Not Implemented');
};

HitBTCClient.prototype.payout = function (amount, currency_code, address) {
    throw new Error('Not Implemented');
};

HitBTCClient.prototype.transactions = function (offset, limit, dir) {
    throw new Error('Not Implemented');
};

// var client = new HitBTCClient('c400a7328769d4b0582a80365b2d8f98', '1b3fde82887787cccf3c56a264a1ee5e', 'live');
// client.tradingBalance(console.log);