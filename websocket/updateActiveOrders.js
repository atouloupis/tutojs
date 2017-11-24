module.exports.newActiveOrders = newActiveOrders;
const exec = require('child_process').exec;

function newActiveOrders (frame){

var activeOrders = require('../data/activeOrders.json');
console.log(JSON.stringify(activeOrders)); 
var k = 0;
	for (var i=0; i < frame.length; i++){
		for (var j=0;j<activeOrders.length;j++)
		{
			if (frame[i].id == activeOrders[j].id)k++; 
			
		}

	}
console.log("Frame lenght"+frame.length+"K ="+k);
// If there is not the same id order in active orders file and in the 
// frame active order received, we DL a new activeOrder file
	if (k != frame.lenght) 
		{
			var yourscript = exec('sh ../batch_activeorder.sh',
				(error, stdout, stderr) => {
				console.log(`${stdout}`);
					console.log(`${stderr}`);
				if (error !== null) {
					console.log(`exec error: ${error}`);
				}
			});
		}
};