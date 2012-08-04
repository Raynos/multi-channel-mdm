var through = require("through")
    , multiChannelRegExp = /(multi-channel-)([\w\W]*)/
    , streams = {}

module.exports = createShoeConnection

function createShoeConnection(callback) {

    return proxyConnections

    function proxyConnections(stream) {
        var meta = stream.meta

        if ("string" !== typeof meta) {
            return callback && callback(stream)
        }

        var regExpResult = meta.match(multiChannelRegExp)

        if (regExpResult === null) {
            return callback && callback(stream)
        }

        var name = regExpResult[2]
            , communicationStream = streams[name]

        if (!communicationStream) {
            communicationStream = streams[name] = through()
        }

        communicationStream.pipe(stream).pipe(communicationStream, {
            end: false
        })
    }
}