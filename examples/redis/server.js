var MultiChannel = require("../..")
    , net = require("net")
    , MuxDemux = require("mux-demux")
    , RedisStore = require("redis-stream-store")
    , redisStore = RedisStore(6379, "localhost", "redis-demo")
    , channel = MultiChannel(redisStore)

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
}).listen(process.argv[2] || 8642)