const processFiles = require('./lib/processFiles');
const listFiles = require('./lib/listFiles');
const update = require('./lib/update');
const render = require('./render');

var ctx = {
    cwd: './test',
    pattern: '**/*.md',
    attemptUpdate: true
};

listFiles(ctx)
    .then(processFiles)
    .then(update)
    .then(render)
    .catch(err => console.dir);