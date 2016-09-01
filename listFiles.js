const fs = require('mz/fs');
const path = require('path');

function scanFolder(folders, prefixes) {

    if (folders.length === 0) return Promise.resolve([]);

    function byFilePrefix(file) {
        if (prefixes.length === 0) return true;
        return prefixes.some(prefix => file.startsWith(prefix));
    }

    var scanning = folders.map(folder => {
        return fs.readdir(path.normalize(folder))
            .then(files => {
                return files.map(file => {

                    var filePath = path.join(folder, file);

                    return fs
                        .stat(filePath)
                        .then(stat => { return { filePath: filePath, stat: stat }; });
                });
            });
    });

    return Promise.all(scanning)
        .then(x => [].concat.apply([], x))
        .then(x => Promise.all(x))
        .then(fd => {

            var subfolders = [];
            var files = [];
            for (var i = 0; i < fd.length; i++) {
                var stat = fd[i].stat;
                var filePath = fd[i].filePath;

                if (stat.isDirectory()) subfolders.push(filePath);
                if (stat.isFile()) files.push(filePath);
            }

            return scanFolder(subfolders, prefixes)
                .then(x => {
                    return x.concat(files);
                });
            //        .then(files => {
            // return files
            //     .filter(byFilePrefix)
            //     .map(file => path.join(folder, file));
        })
        .catch(err => {
            console.dir(err);
        });

}

module.exports = scanFolder;