var through = require("through")
    , MemoryStore = require("memory-store").createStore
    , multiChannelRegExp = /(multi-channel-)([\w\W]*)/

module.exports = createShoeConnection

function createShoeConnection(store) {
    if (!store) {
        store = MemoryStore()
    }

    return proxyConnections

    function proxyConnections(stream, params) {
        var streamName = params.streamName
            
        store.get(streamName, handleStream)

        function handleStream(err, data) {
            if (err) {
                throw err
            }

            var communicationStream = data && data.stream

            if (!communicationStream) {
                communicationStream = through()
                store.set(streamName, {
                    stream: communicationStream
                }, returnError)
            }

            communicationStream.pipe(stream).pipe(communicationStream, {
                end: false
            })
        }
    }

    function returnError(err) {
        if (err) {
            throw err
        }
    }
}