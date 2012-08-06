var through = require("through")
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
            }, partial(pipeStreams, stream, communicationStream))
        } else {
            pipeStreams(stream, communicationStream)
        }
    }
}

function pipeStreams(stream, communicationStream, error) {
    if (error) {
        stream.emit("error", error)
    }

    communicationStream.pipe(stream).pipe(communicationStream, {
        end: false
    })
}