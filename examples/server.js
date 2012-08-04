var multiChannel = require("..")
    , net = require("net")
    , MuxDemux = require("mux-demux")
    , streamStore = require("memory-store")

net.createServer(function (con) {
    var mdm = MuxDemux({
        error: false
    })
    mdm.on("connection", multiChannel(streamStore))
    con.pipe(mdm).pipe(con)
}).listen(8642)