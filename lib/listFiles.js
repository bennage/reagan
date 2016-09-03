const glob = require('resolve-glob');

module.exports = function (ctx) {

    return new Promise((resolve, reject) => {

        glob(ctx.pattern, { cwd: ctx.cwd }, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ files: files, ctx: ctx });
        });
    });
};