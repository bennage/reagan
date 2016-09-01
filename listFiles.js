const fs = require('mz/fs');
const path = require('path');
const glob = require('resolve-glob');

function scanFolder(cwd, pattern) {

    return new Promise((resolve, reject) => {

        glob(pattern, { cwd: cwd }, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });

    });
}

module.exports = scanFolder;