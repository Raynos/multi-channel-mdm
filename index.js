var through = require("through")
    , MemoryStore = require("memory-store")
    , multiChannelRegExp = /(multi-channel-)([\w\W]*)/

module.exports = createShoeConnection

function createShoeConnection(store, callback) {
    if (typeof store === "function" || arguments.length === 0) {
        callback = store
        store = MemoryStore.createStore()
    }

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
            
        store.get(name, handleStream)

        function handleStream(err, data) {
            if (err) {
                return callback && callback(err)
            }

            var communicationStream = data && data.stream

            if (!communicationStream) {
                communicationStream = through()
                store.set(name, {
                    stream: communicationStream
                }, returnError)
            }

            communicationStream.pipe(stream).pipe(communicationStream, {
                end: false
            })

            callback && callback(stream)
        }
    }

    function returnError(err) {
        if (err) {
            return callback && callback(err)
        }
    }
}