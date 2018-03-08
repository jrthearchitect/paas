var express = require('express');
var router = express.Router();
var REQUEST = require('request');
var storage = require('../services/storage');

var db;
exports.initialize = function(dbConnection){
  db = dbConnection;
};

var request = REQUEST.defaults({
  strictSSL: false
});

//var OPENWEATHERURL = "https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/c23baf68ee1cee3c6de9b4e1ab73e654f4597ee431fe6408d0bb906e6774c976/a9f02360-4ef1-46d6-9406-430c27ac582e";
var OPENWEATHERURL = "http://api.openweathermap.org/data/2.5/weather?appid=6b7b471967dd0851d0010cdecf28f829&units=imperial?";

var getCurrentDatetime = function() {
  var currentdate = new Date();
  var datetime = currentdate.getFullYear() + "/" +
    (currentdate.getMonth() + 1) + "/" +
    currentdate.getDate() + " @ " +
    currentdate.getHours() + ":" +
    currentdate.getMinutes() + ":" +
    currentdate.getSeconds();
  return datetime;
};

var guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var computeProxyStr = function() {
  var str = process.env.http_proxy;
  console.log("Proxy Str is " + str);
  return str;
};

var getWeather = function(req, res) {
  var zip = req.query.zip;
  if ((zip === null) || (typeof(zip) === 'undefined')) {
    return res.status(400).send('zip missing');
  }

  var clientId = req.query.clientId;
  if ((clientId === null) || (typeof(clientId) === 'undefined')) {
    clientId = guid();
  }

  var callBack = function(body) {
    console.log(body);
  };

  request({
    method: 'GET',
    url: OPENWEATHERURL + 'clientId=' + clientId + '&zip=' + zip,
    json: true,
    http_proxy: computeProxyStr()
  }, function(err, resp, body) {
    if (err) {
      res.status(400).send(err);
    } else {
      var response = {};
      if (body.cod === 200) {
        var weath = "Conditions are " + body.weather[0].main + " and temperature is " + body.main.temp + ' F';
        response = {
          'colorStyle': '',
          'zip':zip,
          'city': body.name,
          'weather': weath,
          'zipTime': getCurrentDatetime()
        };
        storage.saveInput(db,response, clientId, callBack, callBack);
        return res.status(200).send(response);
      } else {
        response = {
          'colorStyle': 'warningText',
          'city': 'Invalid Zip',
          'weather': 'Invalid Zip'
        };
        return res.status(200).send(response);
      }
    }
  });
};

var loadInputHistory = function(req, res) {
  var clientId = req.query.clientId;
  if ((clientId === null) || (typeof(clientId) === 'undefined')) {
    res.status(200).send([]);
  }

  // var json = [{ //
  //   'zip': "69001", //
  //   'zipCity': "Mc Cook", //
  //   'zipTime': "2018/3/6 @ 23:45:24", //
  //   'zipWeather': "Conditions are Clear and temperature is 274.15 F"
  // }, { //
  //   'zip': "69021",
  //   'zipCity': "Benkelman",
  //   'zipTime': "2018/3/6 @ 23:45:45",
  //   'zipWeather': "Conditions are Clear and temperature is 272.79 F"
  // }];
  //
  // res.status(200).send(json);

  var data = storage.getInputHistory(db,clientId);
  res.status(200).send(data);
};

router.get('/getWeather', getWeather);
router.get('/getHistory', loadInputHistory);

exports.router = router;
