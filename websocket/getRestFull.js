module.exports.getHitBTC=getHitBTC;


function getHitBTC(path,method,callback) {
    var options = {
        host: "https://api.hitbtc.com/",
        port: 80,
        path: path,
        method: method,
        //authorization : 'Basic ' + new Buffer('75ea4dceeb285ee86c026d62700df14f:919c86f1a996fa98ba4fc74ebb1a364d').toString('base64')
    };

    http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            callback(chunk);
        });
    }).end();
}
