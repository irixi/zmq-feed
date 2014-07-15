zmq-feed
========

A simple feed-handler for ZeroMQ that abstracts client pub/sub operations when dealing with a centralized PubSub-proxy. This is a very early release and no one should expect too much. 

### Publisher
```js
var Publisher = require('zmq-feed').Publisher;

var feed = new Publisher('tcp://0.0.0.0:3333');
feed.connect();

var channel = 'equities';
var msg = {
    text: "string",
    int: 0,
    boolean: true
}

feed.publish(channel, msg);
```
### Subscriber
```js
var Subscriber = require('zmq-feed').Subscriber;

var feed = new Subscriber('tcp://0.0.0.0:3334');
feed.connect();

feed.on('message', function(channel, msg) {
    console.log(channel,msg);
    feed.disconnect();
});

```
