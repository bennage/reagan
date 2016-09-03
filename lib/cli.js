#!/usr/bin/env node

const program = require('commander');
const processFiles = require('./processFiles');
const listFiles = require('./listFiles');
const render = require('./render');

function turnOn() {
    return true;
}

program
    .version('0.0.6')
    .option('-f, --folder [folder]', 'the folder to search', '.')
    .option('-i, --include [glob]', 'the pattern to match (defaults to **/*.md)', '**/*.md')
    .option('--strict', 'enforce exact matches', turnOn, false)
    .parse(process.argv);

var ctx = {
    cwd: program.folder,
    pattern: program.include,
    ignoreLanguageComment: !program.strict,
    ignoreWhitespace: !program.strict,
    allowAbbreviations: !program.strict
};

listFiles(ctx)
    .then(processFiles)
    .then(render);