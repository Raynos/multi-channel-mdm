var multiChannel = require("..")
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
            route.fn(stream, route.params, route.splats)
        }
    })
    con.pipe(mdm).pipe(con)
}).listen(8642)