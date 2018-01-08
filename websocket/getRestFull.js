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
                return callback(err);
            }
            callback(false, json);
        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function() {
            req.abort();
        });
    });

    req.end();

}


