const processFiles = require('./lib/processFiles');
const listFiles = require('./lib/listFiles');
const renderForConsole = require('./lib/render');

listFiles('./test', '**/*.md')
    .then(processFiles)
    .then(renderForConsole)
    .catch(err => console.dir);