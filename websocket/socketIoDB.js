var mongoDb = require ('./mongoDb');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
	
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000);

var dbName = "orderBook";
var collectionName = "orderBookFrame";

io.sockets.on('connection', function (socket) {

mongoDb.findRecords(dbName,collectionName,"",function(message){
	console.log(message);
	
	message = JSON.stringify(message);

		socket.broadcast.emit('message',message);
	});
});