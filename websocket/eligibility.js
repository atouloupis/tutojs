var getRestFull = require('./getRestFull')
module.exports.eligibilitySell = sell;
module.exports.eligibilityBuy = buy;
var mongoDb = require('./mongoDb');
var api = require('./getRestFull');

function sell (order,ticker,callback)
{

    //annuler tous les ordres pour ce symbol
    api.getHitBTC("/api/2/order?symbol="+ticker.symbol,"DELETE",function () {

    });
    //si quantité == 1000 € transférer vers wallet bitcoin


    //Récupérer le dernier trade history d'achat. A savoir combien on l'a acheté

// ordre déjà cancel, il faut vérifier combien il y a sur le compte pour cette monnaie
    //getMongo ce qu'il reste


    // récupérer le prix du ticker ask

    //recupérer l'unité prix minimum


    //poser un ordre sur le prix du ticker ask moins 1 unité avec toute la quantité dispo

}

function buy (ticker,callback)
{
///est ce qu'il y a déjà une certaine quantité en stock. Si oui, got to sell

    //quelle est la différence entre order achat et order vente

    //récupérer le trade volume par minute

    // si bid et ask supérieur à X en trade volume par minute lancer l'achat

    //récupérer l'unité prix minimum
    // récupérer la quantité minimum

    //calculer pour 2€ de trade

    //poser l'ordre d'achat


}

function averageTradeVolume(symbol,callback)
{
    //récupérer les 50 derniers trades

    //calcul moyenne temps de trade

    //callback bid et ask moyenne
}