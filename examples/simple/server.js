var MultiChannel = require("../..")
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