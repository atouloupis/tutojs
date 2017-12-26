var getRestFull = require('./getRestFull')
module.exports.eligibilitySell = sell;
module.exports.eligibilityBuy = buy;
var mongoDb = require('./mongoDb');

function sell (order,ticker,callback)
{
// ordre déjà cancel, il faut vérifier combien il y a sur le compte pour cette monnaie
    //getMongo ce qu'il reste


    // récupérer le prix du ticker ask

    //poser un ordre sur le prix du ticker ask moins 1 unité

}

function buy (ticker,callback)
{

}

function averageTradeVolume(symbol,callback)
{
    //récupérer les 50 derniers trades

    //calcul moyenne de trade

    //callback bid et ask moyenne
}