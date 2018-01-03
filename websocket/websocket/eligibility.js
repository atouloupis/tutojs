var getRestFull = require('./getRestFull')
module.exports.eligibilitySell = sell;
module.exports.eligibilityBuy = buy;
var mongoDb = require('./mongoDb');
var api = require('./getRestFull');
var getReports = require('./getReportsActiveOrders');

function sell (ticker,callback)
{
var balanceAvailable=0;
//annuler tous les ordres pour ce symbol
    api.getHitBTC("/api/2/order?symbol="+ticker.symbol,"DELETE",function () {

	});

//Récupérer le dernier trade history d'achat. A savoir combien on l'a acheté
	getReports.getLastBuyTrade(ticker.symbol,function(lastBuyTrade){
	});
	
// il faut vérifier combien il y a sur le compte pour cette monnaie
	api.getHitBTC("/api/2/trading/balance","GET",function(tradingBalance){
	for (var i=0;i<tradingBalance.length;i++) {
		if (tradingBalance.currency == ticker.symbol.substr(0,ticker.symbol.length-3))balanceAvailable=tradingBalance.available;
		}
	});
 
//Récupérer le prix du orderbook ask le plus faible
var collectionName = "orderBookFrame";
var query = {"symbol" : ticker.symbol,"way" : "ask"};
var askLowestPrice=100000000;
	mongoDb.findRecords(collectionName, query, function(message) {
		for (var i = 0; i<message.length;i++)
			{
				if (message[i].params.size!=0.00 && message[i].params.price<askLowestPrice) 
				{
					askLowestPrice=message[i].params.price;
				}
			}				
	});

 //recupérer l'unité prix minimum
	var collectionName = "symbol";
		mongoDb.findRecords(collectionName, "", function(message) {
		for (var i = 0; i<message.length;i++)
			{
				if (message[i].id = ticker.symbol) var tickSize = message[i].tickSize;
			}
		});
		
	//si le ticker ask.price est > trade buy, on vent au prix du marché
	if (askLowestPrice > lastBuyTrade) 
		{ 
		placeNewOrder(ticker.symbol,"sell","market","",balanceAvailable);
		callback();
		}
    //poser un ordre sur le prix du ticker ask moins 1 unité avec toute la quantité dispo
	else 
		{
		placeNewOrder(ticker.symbol,"sell","limit",askLowestPrice-tickSize,balanceAvailable);
		callback();

		}

}

function buy (ticker,callback) {
    var balanceAvailable = 0;
    var ethAvailable = 0;
    //est ce qu'il y a déjà une certaine quantité en stock. Si oui, got to sell
    api.getHitBTC("/api/2/trading/balance", "GET", function (tradingBalance) {
        for (var i = 0; i < tradingBalance.length; i++) {
            if (tradingBalance[i].currency == ticker.symbol.substr(0, ticker.symbol.length - 3)) balanceAvailable = tradingBalance[i].available;
        }
    });

    if (balanceAvailable != 0) {
        sell(ticker, function () {
            callback();
        });
    }
    else {

        //récupérer order achat le plus elevé et order vente le plus faible
        var collectionName = "orderBookFrame";
        var query = {"symbol": ticker.symbol};
        var askLowestPrice = 100000000;
        var bidHighestPrice = 0.00;

        mongoDb.findRecords(collectionName, query, function (message) {
            for (var i = 0; i < message.length; i++) {
                if (message[i].params.size != 0.00 && message[i].params.price > bidLowestPrice && message[i].way == "bid") {
                    bidHighestPrice = message[i].params.price;
                }
                if (message[i].params.size != 0.00 && message[i].params.price < askLowestPrice && message[i].way == "ask") {
                    askLowestPrice = message[i].params.price;
                }
            }


        });

        //quelle est la différence entre order achat et order vente
        var orderDiffPerc = ((askLowestPrice / bidHighestPrice) - 1) * 100;
        var orderDiff=askLowestPrice-bidHighestPrice;

        //récupérer le trade volume par minute
        var tickSize = 0;
        var quantityIncrement = 0;
        averageTradeVolume(ticker.symbol, function (possibleToTrade) {

            // récupérer le tick minimum et la quantité minimum
            var collectionName = "symbol";
            mongoDb.findRecords(collectionName, "", function (message) {
                for (var i = 0; i < message.length; i++) {
                    if (message[i].id = ticker.symbol) {
                        tickSize = message[i].tickSize;
                        quantityIncrement = message[i].quantityIncrement;
                    }
                }
            });
            //si le volume échangé est bon  + la diff entre bid et ask > 5% +  diff entre ask et bid > 10 tick size
            if (possibleToTrade && orderDiffPerc > 5 && orderDiff > (10*tickSize)) {

                //poser l'ordre d'achat
                placeNewOrder(ticker.symbol, "buy", "limit", bidHighestPrice + tickSize, quantityIncrement)
                callback();
            }
            else {
                callback();
            }
        });
    }
}

function averageTradeVolume(symbol,callback)
{
	var date = new Date;
    //récupérer les 50 derniers trades en vente
	var somme = 0;
	getReports.getLastTrades (symbol,50,function(lastTrades){
	//calcul moyenne temps de trade en vente
	for (var i=0; i<lastTrades.length;i++)
		{
		somme += Date.parse(lastTrades[i].timestamp);
		}
	var moyenne =  somme/lastTrades.length;// moyenne dates de trade
	//Si entre la date d'aujourd'hui et le dernier trade < 10 min et la moyenne des trades < 5 min.
	if (date-Date.parse(lastTrades[0].timestamp)<600000 & moyenne < 300000)callback(true);
	else callback(false);
	});
    
}