var through = require("through")
    , StreamStore = require("stream-store")
    , partial = require("ap").partial

module.exports = MultiChannel

function MultiChannel(store) {
    if (!store) {
        store = StreamStore()
    }

    return partial(streamFinder, store)
}

function streamFinder(store, stream, params) {
    var streamName = params && params.streamName || stream.meta
        , communicationStream = store.get(streamName)

    stream.pipe(communicationStream, {
        end: false
    }).pipe(stream)
}
