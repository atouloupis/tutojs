var mongoDb = require ('./mongoDb');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
	
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});



var dbName = "orderBook";
var collectionName = "orderBookFrame";

io.sockets.on('connection', function (socket) {
console.log("Connected");
mongoDb.findRecords(dbName,collectionName,"",function(message){
	console.log("Searched");
	console.log(message);
	
	message = JSON.stringify(message);

		socket.broadcast.emit('message',message);
	});
});

server.listen(3000);