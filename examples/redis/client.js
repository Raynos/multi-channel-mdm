console.log("argv", process.argv)

var net = require("net")
    , MuxDemux = require("mux-demux")
    , mdm = MuxDemux({
        error: false
    })
    , con = net.connect(process.argv[2] || 8642)

mdm.pipe(con).pipe(mdm)

var room1 = mdm.createStream("room1")
    , room2 = mdm.createStream("room2")

room1.on("data", console.log.bind(console, "room1"))
room2.on("data", console.log.bind(console, "room2"))

room1.write("hello")
room2.write("world")