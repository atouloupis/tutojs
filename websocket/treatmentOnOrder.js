var wsConnection = require('./wsClient');
module.exports.cancelOrder = cancelOrder;
module.exports.placeOrder = placeNewOrder;
module.exports.replaceOrder = cancelReplaceOrder;
module.exports.tradingBalance = getTradingBalance;
module.exports.activeOrders = getActiveOrders;

function cancelOrder(id) {
    var query = {
        "method": "cancelOrder",
        "params": {
            "clientOrderId": id
        },
        "id": 123
    };
		console.log("cancel order");
	console.log(query);
    //wsConnection.ws.send(query);
}

function placeNewOrder(symbol,side,type,price,quantity) {
    var query = {
        "method": "newOrder",
        "params": {
            "clientOrderId": generateUUID(),//Required parameter. Uniqueness must be guaranteed within a single trading day, including all active orders.
            "symbol": symbol,
            "side": side,//sell or buy
            "type": type, //Optional. Default - limit. One of: limit, market, stopLimit, stopMarket
            "price": price,
            "quantity": quantity
        },
        "id": 123
    };
	console.log("new order place");
	console.log(query);
    //wsConnection.ws.send(query);
}

function cancelReplaceOrder(clientId,requestId,quantity,price) {
    var query = {
        "method": "cancelReplaceOrder",
        "params": {
            "clientOrderId": clientId,//Replaced order
            "requestClientId": requestId,
            "quantity": quantity,
            "price": price
        },
        "id": 123
    };
    //wsConnection.ws.send(query);
		console.log("cancel or replace order");
	console.log(query);
}

function getTradingBalance() {
    var query = {
        "method": "getTradingBalance",
        "params": {},
        "id": "tradingBalance"
    };
    wsConnection.ws.send(query);
			console.log("getTradingBalance");
	console.log(query);
	
}

function getActiveOrders() {
    var query = { 
	"method": "getOrders", 
	"params": {}, 
	"id": "activeOrders" 
	};
			console.log("getActiveOrders");
	console.log(query);
    wsConnection.ws.send(query);
}

function generateUUID () { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxxxxxx4xxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}