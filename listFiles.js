const fs = require('mz/fs');
const path = require('path');

var folders = [
    '../azure-content-pr/includes/',
    '../azure-content-pr/articles/',
    '../azure-content-pr/articles/guidance/'
];

var prefixes = [
    'guidance-',
    'best-practices-'
];

function fileFilter(file) {
    return prefixes.some(prefix => file.startsWith(prefix));
}

module.exports = function () {

    var p = folders.map(folder => {
        return fs
            .readdir(folder)
            .then(files => {
                return files
                    .filter(fileFilter)
                    .map(file => path.join(folder, file));
            });
    });

    return Promise.all(p).then(all => {
        var flatten = [].concat.apply([], all);
        return flatten;
    });
};