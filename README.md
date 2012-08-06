# multi-channel-mdm

Create multiple channels using mux-demux

## Example server

    var multiChannel = require("multi-channel-mdm")
        , net = require("net")
        , MuxDemux = require("mux-demux")
        , streamStore = require("memory-store").createStore()
        , Router = require("routes").Router
        , router = new Router()
        , Domain = require("domain").create

    router.addRoute("/channel/:streamName", multiChannel(streamStore))

    net.createServer(function (con) {
        var mdm = MuxDemux({
            error: false
        })
        mdm.on("connection", function (stream) {
            var route = router.match(stream.meta)
                , domain = Domain()

            domain.add(stream)

            if (route.fn) {
                domain.bind(route.fn)(stream, route.params, route.splats)
            }

            domain.on("error", function (err) {
                console.log("error occurred!")
                domain.dispose()
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

    var room1 = mdm.createStream("/channel/room1")
        , room2 = mdm.createStream("/channel/room2")

    room1.on("data", console.log.bind(console, "room1"))
    room2.on("data", console.log.bind(console, "room2"))

    room1.write("hello")
    room2.write("world")

## Installation

`npm install multi-channel-mdm`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/multi-channel-shoe.png
  [2]: http://travis-ci.org/Raynos/multi-channel-shoe