module.exports.getHitBTC=getHitBTC;
var https = require('https');

function getHitBTC(path,method,callback) {
    var options = {
        host: "api.hitbtc.com",
        path: path,
        method: method,
	    headers: {
            'Accept': 'application/json',
			'Authorization' : 'Basic ' + new Buffer('c400a7328769d4b0582a80365b2d8f98:1b3fde82887787cccf3c56a264a1ee5e').toString('base64')
			
        },
    };

    https.request(options, function (res) {
        res.setEncoding('utf8');
		res.on('data', function (chunk) {
            callback(chunk);
        });
    }).end();
}
