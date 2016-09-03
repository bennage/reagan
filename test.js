const processFiles = require('./lib/processFiles');
const listFiles = require('./lib/listFiles');
const renderForConsole = require('./lib/renderForConsole');

listFiles('./test', '**/*.md')
    .then(processFiles)
    .then(renderForConsole)
    .catch(err => console.dir);