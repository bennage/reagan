const EventEmitter = require('events').EventEmitter;

class Context extends EventEmitter {

    constructor(options) {
        super();
        Object.keys(options).forEach(x => {
            this[x] = options[x];
        });
    }
}

module.exports = Context;