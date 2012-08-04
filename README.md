# multi-channel-shoe

Create multiple channels using shoe

## Example server

    var multiChannel = require("..")
        , net = require("net")
        , MuxDemux = require("mux-demux")

    net.createServer(function (con) {
        var mdm = MuxDemux({
            error: false
        })
        mdm.on("connection", multiChannel())
        con.pipe(mdm).pipe(con)
    }).listen(8642)

## Example client

    var net = require("net")
        , MuxDemux = require("mux-demux")
        , mdm = MuxDemux()
        , con = net.connect(8642)

    mdm.pipe(con).pipe(mdm)

    var room1 = mdm.createStream("multi-channel-room1")
        , room2 = mdm.createStream("multi-channel-room2")

    room1.on("data", console.log.bind(console, "room1"))
    room2.on("data", console.log.bind(console, "room2"))

    room1.write("hello")
    room2.write("world")

## Installation

`npm install multi-channel-shoe`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/multi-channel-shoe.png
  [2]: http://travis-ci.org/Raynos/multi-channel-shoe