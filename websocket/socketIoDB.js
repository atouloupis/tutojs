var mongoDb = require ('./mongoDb');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var dbName = "orderBook";
var collectionName = "orderBookFrame";


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//io.on('connection', function(socket){
//mongoDb.findRecords(dbName,collectionName,"",function(message){
	console.log("Searched");
	//console.log(message);
	
	//message = JSON.stringify(message);

		io.emit('message','message commming from IO');
//	});
//});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
