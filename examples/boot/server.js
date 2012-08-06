var http = require('http')
    , path = require("path")
    , through = require("through")
    , browserify = require("browserify")

var server = http.createServer(function (req, res) {
    if (req.url === "/bundle.js") {
        var b = browserify()
        b.addEntry(path.join(__dirname, "./client.js"))
        res.end(b.bundle())
    } else {
        res.end("<script src='bundle.js'></script>")
    }
})
server.listen(8081)

var boot = require("boot")
    , multiChannel = require("../..")
    , Router = require("routes").Router

var streamRouter = new Router()
streamRouter.addRoute("/channel/:streamName", multiChannel())

var sock = boot(function (stream) {
    var route = streamRouter.match(stream.meta)

    if (route.fn) {
        route.fn(stream, route.params)
    }

    stream.on("error", function (err) {
        console.log("error occurred!", err.message)
        stream.end()
    })
})

sock.install(server, "/boot")