#!/usr/bin/env node

var wsClient = require ('./wsClient');


var app = require('express')(),
    server = require('http').createServer(app),
	fs = require('fs');
	
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

server.listen(8080);
