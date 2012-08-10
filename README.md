# multi-channel-mdm

Create multiple channels using mux-demux

## Example server

A channel is a function that pipes up the incoming stream to a persistant stream based on the incoming stream name.

This means that when multiple clients connect to the channel then each message to the channel is relayed to all of them

``` js
var MultiChannel = require("multi-channel-mdm")
    , MuxDemux = require("mux-demux-net")
    , channel = MultiChannel()

MuxDemux(channel, 8642)
```

## Example client

Spin up multiple clients to note that each has been piped up to the back end channel. This basically functions as broadcasting to all open connections to the channel

``` js
var MuxDemux = require("mux-demux-net")
    , mdm = MuxDemux(8642)

var room1 = mdm.createStream("room1")
    , room2 = mdm.createStream("room2")

room1.on("data", console.log.bind(console, "room1"))
room2.on("data", console.log.bind(console, "room2"))

room1.write("hello")
room2.write("world")
```

## Example server using a router

multi channel was created to interact nicely with the stream router. 

Notice how you can also pass a persistance store directly to multi channel so you have control over how the streamName to stream mapping occurs

``` js
var MultiChannel = require("../..")
    , MuxDemux = require("mux-demux-net")
    , StreamRouter = require("stream-router")
    , StreamStore = require("stream-store")
    
var router = StreamRouter(StreamStore())
    , channel = MultiChannel()

MuxDemux(router, 8642)

router.addRoute("/channel/:streamName", channel)
```

## Example server using a redis store

If you use a store that has a database you can distribute your channels!

``` js
var MultiChannel = require("../..")
    , MuxDemux = require("mux-demux-net")
    , RedisStore = require("redis-stream-store")

var redisStore = RedisStore(6379, "localhost", "redis-demo")
    , channel = MultiChannel(redisStore)

MuxDemux(channel, process.argv[2] || 8642)
```

## Installation

`npm install multi-channel-mdm`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/multi-channel-shoe.png
  [2]: http://travis-ci.org/Raynos/multi-channel-shoe