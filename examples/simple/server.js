var MultiChannel = require("../..")
    , MuxDemux = require("mux-demux-net")
    , channel = MultiChannel()

MuxDemux(channel, 8642)