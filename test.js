const colors = require('colors');
const processFiles = require('./processFiles');
const listFiles = require('./listFiles');
const renderForConsole = require('./renderForConsole');

listFiles('~/dev/azure-content-pr/articles/guidance', '**/*.md')
    .then(processFiles)
    .then(renderForConsole)
    .catch(err => console.dir);