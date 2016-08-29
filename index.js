
const colors = require('colors');
const processFiles = require('./processFiles');

var markdownFiles = [
    '../azure-content-pr/includes/guidance-compute-single-vm-linux.md',
    '../azure-content-pr/includes/guidance-compute-single-vm-windows.md'
];

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

processFiles(markdownFiles)
    .then(results => {

        // output for console
        results.forEach(r => {
            r.diffs.map(renderDiff);
        });

        console.log();
        results.forEach(r => {
            console.log(`${r.filePath}`);
            console.log(`>> ${countDifferingBlocks(r.diffs)} block(s) differ`);
        });
    });