# multi-channel-mdm

Create multiple channels using mux-demux

## Example server

    var MultiChannel = require("multi-channel-mdm")
        , net = require("net")
        , MuxDemux = require("mux-demux")
        , channel = MultiChannel()

    net.createServer(function (con) {
        var mdm = MuxDemux({
                error: false
            })

        mdm.on("connection", function (stream) {
            channel(stream, {
                streamName: stream.meta
            })
        })
        
        con.pipe(mdm).pipe(con)
    }).listen(8642)

## Example client

    var net = require("net")
        , MuxDemux = require("mux-demux")
        , mdm = MuxDemux()
        , con = net.connect(8642)

    mdm.pipe(con).pipe(mdm)

    var room1 = mdm.createStream("room1")
        , room2 = mdm.createStream("room2")

    room1.on("data", console.log.bind(console, "room1"))
    room2.on("data", console.log.bind(console, "room2"))

    room1.write("hello")
    room2.write("world")

## Example server using a router

multi channel was created to interact nicely with the routes router. Notice how you can also pass a persistance store directly to multi channel so you have control over how the streamName to stream mapping occurs

    var multiChannel = require("multi-channel-mdm")
        , net = require("net")
        , MuxDemux = require("mux-demux")
        , streamStore = require("memory-store").createStore()
        , Router = require("routes").Router
        , router = new Router()

    router.addRoute("/channel/:streamName", multiChannel(streamStore))

    net.createServer(function (con) {
        var mdm = MuxDemux({
            error: false
        })
        mdm.on("connection", function (stream) {
            var route = router.match(stream.meta)

            if (route.fn) {
                route.fn(stream, route.params)
            }

            stream.on("error", function (err) {
                console.log("error occurred!", err.message)
                stream.end()
            })
        })
        con.pipe(mdm).pipe(con)
    }).listen(8642)

## Installation

`npm install multi-channel-mdm`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/multi-channel-shoe.png
  [2]: http://travis-ci.org/Raynos/multi-channel-shoe