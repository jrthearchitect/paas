/*jshint node:true*/

var express = require("express");
var bodyParser = require('body-parser');
var http = require('http');
var apiv1 = require('./routes/apiv1.js');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var databaseUrl = process.env.database ? process.env.database : //
  "mongodb://admin:CNKHJTGLWZGNPRXW@sl-us-south-1-portal.20.dblayer.com:33341,sl-us-south-1-portal.19.dblayer.com:33341/compose?authSource=admin&ssl=true";

var EJS = require('ejs');

EJS.open = "<ejs>";
EJS.close = "</ejs>";

var host = process.env.PORT ? '0.0.0.0' : 'localhost';
var port = (process.env.PORT || 3456);
var url = require('url').format({
  hostname: host,
  port: port,
  protocol: 'http'
});

var app = express();
app.use(express.static('static'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/api/v1/', apiv1.router);
app.get("/", function(req, res) {
  return res.render('main');
});

MongoClient.connect(databaseUrl, function(err, db) {
  if (db !== undefined) {
    apiv1.initialize(db);
    http.createServer(app).listen(port, function() {
      console.log('Weather Report listening on ' + url);
    });
  } else {
    console.log('Failed to connect to DB');
    console.error(error);
  }
});
