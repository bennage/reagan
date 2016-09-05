const listFiles = require('./listFiles');
const processFiles = require('./processFiles');
const update = require('./options/update');

module.exports = ctx => {
    return listFiles(ctx)
        .then(processFiles)
        .then(update)
        .then(x => {
            ctx.emit('end', x);
            return x;
        });
};
