#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');
const processFiles = require('./processFiles');
const listFiles = require('./listFiles');

function renderDiff(diff) {

    process.stdout.write(`\n`);
    process.stdout.write(`\n>> ${diff.file}`);
    process.stdout.write(`\n>> lines ${diff.firstLine} - ${diff.lastLine}\n`);

    if (diff.length === 1) {
        process.stdout.write('no change');
        return;
    }

    diff.forEach(part => {
        // green for additions, red for deletions 
        // grey for common parts 
        var color = part.added ? 'green' :
            part.removed ? 'red' : 'grey';
        process.stderr.write(part.value[color]);
    });
}

function countDifferingBlocks(diffs) {
    return diffs.filter(x => x.filter(y => y.value.trim() !== '').length > 1).length;
}

function collect(val, memo) {
    memo.push(val);
    return memo;
}

program
    .version('0.0.1')
    .option('-f, --folder [folder]', 'folder with markdown files to search', collect, [])
    .option('-p, --prefix [file-prefix]', 'file prefix for filtering markdown files', collect, [])
    .parse(process.argv);

if (program.folder.length === 0) program.folder[0] = '.';

listFiles(program.folder, program.prefix)
    .then(processFiles)
    .then(results => {

        if (results.length === 0) {
            console.log(`Nothing was found!`);
            return;
        }

        // output for console
        results.forEach(r => {
            r.diffs.map(renderDiff);
        });

        console.log();
        console.log(`processed ${results.length} files`);

        results.forEach(r => {
            var count = countDifferingBlocks(r.diffs);
            if (count === 0) return;

            console.log(`${r.filePath}`);
            console.log(`>> ${count} block(s) differ`);
        });
    });