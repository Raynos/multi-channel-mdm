var MuxDemux = require("mux-demux-net")
    , mdm = MuxDemux(8642)

var room1 = mdm.createStream("/channel/room1")
    , room2 = mdm.createStream("/channel/room2")

room1.on("data", console.log.bind(console, "room1"))
room2.on("data", console.log.bind(console, "room2"))

room1.write("hello")
room2.write("world")