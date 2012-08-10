var MultiChannel = require("../..")
    , MuxDemux = require("mux-demux-net")
    , StreamRouter = require("stream-router")
    
var router = StreamRouter()
    , channel = MultiChannel()

MuxDemux(router, 8642)

router.addRoute("/channel/:streamName", channel)