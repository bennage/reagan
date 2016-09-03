#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const processFiles = require('./processFiles');
const listFiles = require('./listFiles');
const update = require('./options/update');
const render = require('./render');

function turnOn() {
    return true;
}

program
    .version('0.0.6')
    .option('-f, --folder [folder]', 'the folder to search', '.')
    .option('-i, --include [glob]', 'the pattern to match (defaults to **/*.md)', '**/*.md')
    .option('-u, --update', 'attempt to update local files')
    .option('--strict', 'enforce exact matches', turnOn, false)
    .parse(process.argv);

if (program.update) {
    program.strict = true;
    console.log(chalk.yellow.bold(`--update implies --strict`));
}

var ctx = {
    cwd: program.folder,
    pattern: program.include,
    attemptUpdate: program.update,
    ignoreLanguageComment: !program.strict,
    ignoreWhitespace: !program.strict,
    allowAbbreviations: !program.strict
};

listFiles(ctx)
    .then(processFiles)
    .then(update)
    .then(render);