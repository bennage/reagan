#!/usr/bin/env node

const program = require('commander');
const processFiles = require('./processFiles');
const listFiles = require('./listFiles');
const renderForConsole = require('./renderForConsole');

program
    .version('0.0.1')
    .option('-f, --folder [folder]', 'the folder to search', '.')
    .option('-i, --include [glob]', 'the pattern to match (defaults to **/*.md)', '**/*.md')
    .parse(process.argv);

listFiles(program.folder, program.include)
    .then(processFiles)
    .then(renderForConsole);