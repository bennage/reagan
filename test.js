const processFiles = require('./processFiles');
const listFiles = require('./listFiles');
const renderForConsole = require('./renderForConsole');

listFiles('./test', '**/*.md')
    .then(processFiles)
    .then(renderForConsole)
    .catch(err => console.dir);