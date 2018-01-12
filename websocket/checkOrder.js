module.exports.hasAnOrder = hasAnOrder;
var treatmentOnOrder=require('./treatmentOnOrder');
var get=require('./getReportsActiveOrders');
var eligibility = require('./eligibility');
var mongoDb = require('./mongoDb');


function hasAnOrder(tickerFrame) {
console.log(6);
    get.getActiveOrders(tickerFrame.params.symbol,function(activeOrder){
//console.log(activeOrder);
console.log(7);
	    if (activeOrder != undefined) {
            activeSellOrBuy(activeOrder, tickerFrame.params);
			// console.log("activeOrder status not undefined");
    }
    else {
	console.log(8);
	eligibility.eligibilityBuy(tickerFrame.params,function(){});
	// console.log("activeOrder undefined");
	} //vérifier si on lance un ordre d'achat sur cette monnaie
    });
}

function activeSellOrBuy(order, ticker) {
    if (order.side == "sell") {
        var diff = orderThanMarket(order, ticker, "bid");
        orderBookVolumes(order, "ask", function (volume) {
		//console.log("orderBookVolumes");
		//console.log(order);
		//console.log("volume");
		//console.log(volume);
		//console.log("diff"+diff)
            //Si la diff entre notre ordre de vente et le ticker d'achat bid est inf 1% alors vendre au prix
            if (diff < -1) {
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                treatmentOnOrder.placeOrder(order.symbol, "sell", "market", "", order.quantity);
            }
            //console.log("ticker ask")
            //console.log(ticker.ask)
            //console.log("order price")
            else if (ticker.ask > order.price) {
                //stopScript, on continue;
                //console.log(order.price)
                //sinon est ce que le volume de l'orderbook ask inf+orderbook égal a mon ordre est supérieur de 10 fois la quantité de mon ordre
            } else if ((volume.inf + volume.equal) > 10 * order.quantity) {
                //Si oui on annule l'ordre et on appelle l'eligibilité
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                //console.log("order quantity")
                //console.log( order.quantity)
                eligibility.eligibilitySell(ticker, function () {
                }); //vérifier si on lance un ordre de vente sur cette monnaie
                //Si non, on continue
            } else {
            }
        });
    }
    if (order.side == "buy") {
        var diff = orderThanMarket(order, ticker, "ask");
        orderBookVolumes(order, "bid", function (volume) {
            //SI diff entre notre ordre d'achat et le ticker de vente ask  inf 1% alors annuler l'ordre
			//console.log ("tick bid"+ticker.bid+"order price"+order.price);
			//console.log("volume inf ="+volume.inf+" volume equal ="+volume.equal+" order quantity ="+order.quantity);
            if (diff < 1) {
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                eligibility.eligibilityBuy(ticker, function () {
                });//vérifier si on lance un ordre de vente sur cette monnaie
            }
            //Sinon est ce que le ticker d'achat bid est inférieur à mon ordre d'achat
            else if (ticker.bid < order.price) {            }//Si oui on continue
            //Sinon est ce que le volume de l'orderbook bid inf a mon ordre est supérieur de X% au volume total
			
            else if ((volume.inf + volume.equal) > 10 * order.quantity) {
                //Si oui on annule mon ordre
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                eligibility.eligibilityBuy(ticker, function () {
                });//vérifier si on lance un ordre de vente sur cette monnaie
            }
            //Si non, on continue
            else {
            }
        });
    }
}

//Actual order compared to the market, higher or lower than a specified X%age.
//orderSide = buy or sell, marketSide= ask or bid, gapSide = positive or negative
function orderThanMarket(order, ticker, marketSide) {
    if (marketSide == "bid") var diff = ((ticker.bid / order.price) - 1) * 100;
    if (marketSide == "ask") var diff = ((ticker.ask / order.price) - 1) * 100;
	//console.log("diff ask =" + ticker.ask+"/"+order.price);
    return diff;
}

function orderBookVolumes(order, marketSide, callback) {
    //volume orderbook ask devant le order sell superieur a x% du volume orderbook ask global alors cancel le order sell
    var query={symbol:order.symbol, way:marketSide};
    mongoDb.findRecords("orderBookFrame", query,{_id: -1}, function(message) {
        var totalVolume=0;
        var volInfOrder=0;
        var volSupOrder = 0;
        var volEqualOrder = 0;
        for (var i = 0; i < message.length; i++) {
                if (message[i].params.size != 0.00)
                {
                    totalVolume=totalVolume+parseFloat(message[i].params.size);
                    if (message[i].params.price < order.price) volInfOrder+=parseFloat(message[i].params.size);
                        else if (message[i].params.price == order.price) volEqualOrder+=parseFloat(message[i].params.size);
                    else if (message[i].params.price > order.price) volSupOrder+=parseFloat(message[i].params.size);
                }
        }
		//console.log("totalVolume =" +totalVolume+"volInfOrder"+volInfOrder+"volEqualOrder"+volEqualOrder+"volSupOrder"+volSupOrder);
        callback({
            "total" : totalVolume,
            "inf" : volInfOrder,
            "equal" : volEqualOrder,
            "sup" : volSupOrder
        });
    });
}