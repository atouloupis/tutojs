module.exports.newActiveOrders = newActiveOrders;


function newActiveOrders (frame){

var activeOrders = require('../data/activeOrders.json');
console.log(JSON.stringify(activeOrders)); 

	for (var i=0; i < frame.length; i++){
		for (var j=0;j<activeOrders.length;j++)
		{
			if (frame[i].symbol == activeOrders[j].symbol) console.log(JSON.stringify(activeOrders[j].symbol));
		}		
	}

};