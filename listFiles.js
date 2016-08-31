const fs = require('mz/fs');
const path = require('path');

// var folders = [
//     '../azure-content-pr/includes/',
//     '../azure-content-pr/articles/',
//     '../azure-content-pr/articles/guidance/'
// ];

// var prefixes = [
//     'guidance-',
//     'best-practices-'
// ];

module.exports = function (folders, prefixes) {

    function byFilePrefix(file) {
        if (prefixes.length === 0) return true;
        return prefixes.some(prefix => file.startsWith(prefix));
    }

    var reading = folders.map(folder => {
        return fs
            .readdir(path.normalize(folder))
            .then(files => {
                return files
                    .filter(byFilePrefix)
                    .map(file => path.join(folder, file));
            });
    });

    return Promise.all(reading).then(all => {
        var flatten = [].concat.apply([], all);
        return flatten;
    });
};