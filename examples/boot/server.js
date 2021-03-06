var browserifyServer = require("browserify-server")
    , http = require("http")
    , path = require("path")
    , boot = require("boot")
    , MultiChannel = require("../..")
    , StreamRouter = require("stream-router")

var handler = browserifyServer(path.join(__dirname, "static"))
    , server = http.createServer(handler).listen(8080)
    , streamRouter = StreamRouter()
    , sock = boot(streamRouter)
    , channel = MultiChannel()

streamRouter.addRoute("/channel/:streamName", channel)
sock.install(server, "/boot")