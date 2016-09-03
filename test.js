const processFiles = require('./lib/processFiles');
const listFiles = require('./lib/listFiles');
const renderForConsole = require('./lib/render');

var ctx = {
    cwd: './test',
    pattern: '**/*.md'
};

listFiles(ctx)
    .then(processFiles)
    .then(renderForConsole)
    .catch(err => console.dir);