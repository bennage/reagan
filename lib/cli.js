#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const Context = require('./context');
const render = require('./render');
const app = require('./app');

program
    .version('0.0.8')
    .option('-f, --folder [folder]', 'the folder to search', '.')
    .option('-i, --include [glob]', 'the pattern to match (defaults to **/*.md)', '**/*.md')
    .option('-u, --update', 'attempt to update local files')
    .option('--strict', 'enforce exact matches')
    .parse(process.argv);

console.log(chalk.italic.magenta('✪ trust, but verify ✪'));

if (program.update) {
    program.strict = true;
    console.log(`${chalk.yellow.bold('warning:')} enabling '--update' turns on '--strict'`);
}

var options = {
    cwd: program.folder,
    pattern: program.include,
    attemptUpdate: program.update,
    ignoreLanguageComment: !program.strict,
    ignoreWhitespace: !program.strict,
    allowAbbreviations: !program.strict
};

var ctx = new Context(options);

render(ctx);

app(ctx)
    .then(_ => { process.exit(); })
    .catch(err => {
        console.dir(err);
        process.exit(1);
    });