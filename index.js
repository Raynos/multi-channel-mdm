var through = require("through")
    , PauseStream = require("pause-stream")
    , MemoryStore = require("memory-store").createStore
    , partial = require("ap").partial
    , multiChannelRegExp = /(multi-channel-)([\w\W]*)/

module.exports = MultiChannel

function MultiChannel(store) {
    if (!store) {
        store = MemoryStore()
    }

    return partial(streamFinder, store)
}

function streamFinder(store, stream, params) {
    var streamName = params.streamName
        , buffer = PauseStream()

    buffer.pause()

    stream.pipe(buffer)
        
    store.get(streamName, streamSaver)

    function streamSaver(error, data) {
        if (error) {
            return stream.emit("error", error)
        }

        var communicationStream = data && data.stream

        if (!communicationStream) {
            communicationStream = through()
            store.set(streamName, {
                stream: communicationStream
            }, pipeStreams)
        } else {
            pipeStreams(null)
        }


        function pipeStreams(error) {
            if (error) {
                stream.emit("error", error)
            }

            buffer.pipe(communicationStream, {
                end: false
            }).pipe(stream)

            buffer.resume()
        }
    }
}
