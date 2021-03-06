process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config')[process.env.NODE_ENV]['consumerProducer'];
var simulation = new (require('../utils/simulation'))(config);
var app = require('express')();
var server = require('http').Server(app);
server.listen(config.port);
console.log('consumer production server listening on port ' + config.port);

var discoveryClient = new (require('../utils/discoverClient'))(config);
discoveryClient.discover('consumer', 'consumer', function(err, data) {
  
  var socket = require('socket.io-client')(JSON.parse(data.body)[0].ip + '/production');
  var simulationStartTime = Date.now();

  socket.on('connect', function() {
    console.log('Connected to my consumer!');
  });

  var currentProduction = config.min;

  // To change production ouput
  setInterval(function() {
    currentProduction = simulation.timeBasedChange(currentProduction, simulationStartTime, config.min, config.max);
  }, 1000) 

  setInterval(function () {
    socket.emit('production', {
      currentProduction: currentProduction
    });
  }, 1000);
})
