var multiChannel = require("..")
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