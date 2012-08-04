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