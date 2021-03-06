angular.module('consumer.services', [])
  .factory('Socket', function ($rootScope) {
    var socket = io.connect('http://localhost:8002/client');
    var dataCallbacks = {};
    var brokerReceiptCallbacks = {};
    var systemReceiptCallbacks = {};
    var array = [];

    socket.on('data', function(data){
      for (var key in dataCallbacks) {
        dataCallbacks[key](data);
      }
    });

    socket.on('brokerReceipt', function(data) {
      array.unshift(data);
      for (var key in brokerReceiptCallbacks) {
        brokerReceiptCallbacks[key](data);
      } 
    });

    socket.on('systemReceipt', function(data) {
      array.unshift(data);
      for (var key in systemReceiptCallbacks) {
        systemReceiptCallbacks[key](data);
      } 
    });

    return {
      array: array,
      on: function (view, callback) {
        dataCallbacks[view] = callback;
      },
      onBrokerReceipt: function(view, callback) {
        brokerReceiptCallbacks[view] = callback;
      },
      onSystemReceipt: function(view, callback) {
        systemReceiptCallbacks[view] = callback;
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          if (callback) {
            callback.apply(socket, args);
          }
        });
      }
    }
  })
