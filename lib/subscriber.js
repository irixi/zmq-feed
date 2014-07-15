var zmq = require('zmq'),
  ev = require('events'),
  util = require('util'),
  uuid = require('node-uuid');

function Subscriber(proxy) {
  this.proxy = proxy;

  ev.EventEmitter.call(this);
}

util.inherits(Subscriber, ev.EventEmitter);

Subscriber.prototype.connect = function() {
  this.connectToProxy();
}

Subscriber.prototype.disconnect = function() {
  if (this.socket) {
    this.socket.close();
  }
}

Subscriber.prototype.connectToProxy = function() {
  var _this = this;

  if (this.socket) {
    this.socket.close();
  }

  this.name = uuid.v4();
  this.socket = zmq.socket('sub');
  this.socket.identity = new Buffer(this.name);

  this.socket.on('message', function() {
    _this.incoming.call(_this, arguments);
  })
  this.socket.connect(this.proxy);
}

Subscriber.prototype.subscribe = function(channel) {
  var chan = new Buffer(channel);
  if (this.socket) {
    this.socket.subscribe(channel);
  } else {
    console.log("Not connected.");
  }
}

Subscriber.prototype.incoming = function(data) {
  var payload = data[0].toString().split(' ');
  // payload[0] is the channel
  // payload[1] is the body
  var channel = payload[0];
  var body = JSON.parse(payload[1]);

  this.emit.apply(this, ['message', channel, body]);
}

module.exports = Subscriber;
