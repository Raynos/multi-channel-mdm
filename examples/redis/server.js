var MultiChannel = require("../..")
    , MuxDemux = require("mux-demux-net")
    , RedisStore = require("redis-stream-store")

var redisStore = RedisStore(6379, "localhost", "redis-demo")
    , channel = MultiChannel(redisStore)

MuxDemux(channel, process.argv[2] || 8642)