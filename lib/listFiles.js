const Glob = require('glob').Glob;

module.exports = ctx => {

    return new Promise((resolve, reject) => {

        ctx.emit('files.start');

        var globbing = new Glob(ctx.pattern, { cwd: ctx.cwd }, (err, files) => {

            if (err) {
                ctx.emit('error', err);
                reject(err);
                return;
            }

            ctx.emit('files.end', files);

            resolve({ files: files, ctx: ctx });
        });

        globbing.on('match', x => {
            ctx.emit('files.found', x);
        });
    });
};