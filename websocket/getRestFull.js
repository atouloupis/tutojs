module.exports.getHitBTC=getHitBTC;
var https = require('https');

function getHitBTC(path,method,callback) {
    var options = {
        host: "api.hitbtc.com",
        port: 80,
        path: path,
        method: method,
		ciphers: 'ALL',
      secureProtocol: 'TLSv1_method'
        //authorization : 'Basic ' + new Buffer('c400a7328769d4b0582a80365b2d8f98:1b3fde82887787cccf3c56a264a1ee5e').toString('base64')
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
