module.exports.hasAnOrder = hasAnOrder;
var treatmentOnOrder=require('./treatmentOnOrder');
var get=require('./getReportsActiveOrders');
var eligibility = require('./eligibility');


function hasAnOrder(tickerFrame) {
	get.getActiveOrders(tickerFrame.params.symbol,function(activeOrder){
    // console.log("#"+JSON.stringify(tickerFrame));
	if (activeOrder.status != "undefined") {  
            activeSellOrBuy(activeOrder, tickerFrame);
			console.log("activeOrder status undefined");
    }
    else console.log("activeorder status defined");//eligibility.eligibilityBuy(tickerFrame,function(){}); //vérifier si on lance un ordre d'achat sur cette monnaie
    });
}

function activeSellOrBuy(order, ticker) {
    //console.log("ORDER : "+JSON.stringify(order));
    if (order.side == "sell") {
        var diff = orderThanMarket(order, ticker, "bid");
        orderBookVolumes(order, "ask", function (volume) {
		console.log("orderBookVolumes");
		console.log(order);
		console.log(volume);
            //Si la diff entre notre ordre de vente et le ticker d'achat bid est inf 5% alors vendre au prix
            if (diff < -5) {
                treatmentOnOrder.cancelOrder(order.id);
                treatmentOnOrder.placeOrder(order.symbol, "sell", "market", "", order.quantity);
            }
            else if (ticker.params.ask > order.price) {
                //stopScript, on continue;

                //sinon est ce que le volume de l'orderbook ask inf+orderbook égal a mon ordre est supérieur de 10 fois la quantité de mon ordre
            } else if ((volume.inf + volume.equal) > 10 * order.quantity) {
                //Si oui on annule l'ordre et on appelle l'eligibilité
                treatmentOnOrder.cancelOrder(order.id);
                //eligibility.eligibilitySell(ticker, function () {
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
            if (diff < 1) {
                treatmentOnOrder.cancelOrder(order.id);
                //eligibility.eligibilityBuy(ticker, function () {
                });//vérifier si on lance un ordre de vente sur cette monnaie
            }
            //Sinon est ce que le ticker d'achat bid est inférieur à mon ordre d'achat
            else if (ticker.params.bid < order.price) {
            }//Si oui on continue
            //Sinon est ce que le volume de l'orderbook bid inf a mon ordre est supérieur de X% au volume total
            else if ((volume.inf + volume.equal) > 10 * order.quantity) {
                //Si oui on annule mon ordre
                treatmentOnOrder.cancelOrder(order.id);
                //eligibility.eligibilityBuy(ticker, function () {
                });//vérifier si on lance un ordre de vente sur cette monnaie
            }
            //Si non, on continue
            else {
            }
        });
        console.log("TICKER : " + JSON.stringify(ticker));
    }
}

//Actual order compared to the market, higher or lower than a specified X%age.
//orderSide = buy or sell, marketSide= ask or bid, gapSide = positive or negative
function orderThanMarket(order, ticker, marketSide) {
    if (marketSide == "bid") var diff = ((ticker.params.bid / order.price) - 1) * 100;
    if (marketSide == "ask") var diff = ((ticker.params.ask / order.price) - 1) * 100;
    console.log("DIFF : " + marketSide + JSON.stringify(diff));
    return diff;
}

function orderBookVolumes(order, marketSide, callback) {
    //volume orderbook ask devant le order sell superieur a x% du volume orderbook ask global alors cancel le order sell
    var query={symbol:order.symbol, way:marketSide};
    mongoDb.findRecords("orderBookFrame", query, function(message) {
        var totalVolume=0;
        var volInfOrder=0;
        var volSupOrder = 0;
        var volEqualOrder = 0;
        for (var i = 0; i < message.length; i++) {
                if (message[i].params.size != 0.00)
                {
                    totalVolume=totalVolume+message[i].params.size;
                    if (message[i].params.price < order.price) volInfOrder=volInfOrder+message[i].params.size;
                        else if (message[i].params.price == order.price) volEqualOrder=volEqualOrder+message[i].params.size;
                    else if (message[i].params.price > order.price) volSupOrder=volSupOrder+message[i].params.size;
                }
        }
        callback({
            "total" : totalVolume,
            "inf" : volInfOrder,
            "equal" : volEqualOrder,
            "sup" : volSupOrder
        });
    });


} //console.log("#####"+JSON.stringify(order));