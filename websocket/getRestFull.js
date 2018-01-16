module.exports.getHitBTC=getHitBTC;
var https = require('https');

function getHitBTC(path,method,callback) {
    
	jsonfile.readFile(keyfile, function (err, obj) {
if (err) throw err;


	var options = {
        host: "api.hitbtc.com",
        path: path,
        method: method,
	    headers: {
            'Accept': 'application/json',
			'Authorization' : 'Basic ' + new Buffer(obj.hitbtc.pKey+':'+obj.hitbtc.sKey).toString('base64')
			
        }
    };
	};
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        var buffer = '';
        res.on('data', function (data) {
            buffer += data;
        });

        res.on('end', function () {
            try {
			
                var json = JSON.parse(buffer);
            } catch (err) {
			// console.log(buffer);
			// console.log(options);
                return callback(err);
            }
            callback(false, json);
        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(10000);
        socket.on('timeout', function() {
            req.abort();
        });
    });

    req.end();

}
