const glob = require('resolve-glob');

module.exports = function (cwd, pattern) {

    var context = {
        cwd: cwd,
        pattern: pattern
    };

    return new Promise((resolve, reject) => {

        glob(pattern, { cwd: cwd }, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ files: files, context: context });
        });
    });
};