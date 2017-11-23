#!/usr/bin/env node

var WebSocketClient = require('websocket').client;
var jsonfile = require('jsonfile');
var treatment = require('./treatmentFrame');
var updtOrders = require ('./updateActiveOrders');
var wsClient = require ('./wsClient');
