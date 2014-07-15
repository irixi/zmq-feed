var zmq = require('zmq'),
  ev = require('events'),
  util = require('util'),
  uuid = require('node-uuid');

function Publisher(proxy) {
  this.proxy = proxy;

  ev.EventEmitter.call(this);
}

util.inherits(Publisher, ev.EventEmitter);

Publisher.prototype.connect = function() {
  this.connectToProxy();
}

Publisher.prototype.disconnect = function() {
  if (this.socket) {
    this.socket.close();
  }
}

Publisher.prototype.connectToProxy = function() {
  var _this = this;

  if (this.socket) {
    this.socket.close();
  }

  this.name = uuid.v4();
  this.socket = zmq.socket('pub');
  this.socket.identity = new Buffer(this.name);
  this.socket.connect(this.proxy);
}

Publisher.prototype.publish = function(channel, message) {
  var chan = new Buffer(channel);
  var msg = JSON.stringify(message);
  if (this.socket) {
    this.socket.send(channel + ' ' + msg);
  } else {
    console.log("Not connected.");
  }
}

module.exports = Publisher;
