const chalk = require('chalk');
const error = chalk.bold.red;
const success = chalk.bold.green;
const underline = chalk.white;

function renderDiff(block) {

    var location = `lines ${block.firstLine}-${block.lastLine}`;

    if (block.diff.length === 1) {
        process.stdout.write(success('✓ '));
        process.stdout.write(location);
        process.stdout.write('\n');
        return;
    }

    process.stderr.write(error('✗ '));
    process.stderr.write(location);
    process.stderr.write('\n');

    var sample = block.diff.filter(x => !x.added);
    var source = block.diff.filter(x => !x.removed);

    process.stderr.write(underline('\nlocal sample:\n'));
    renderBlock(sample);

    process.stderr.write(underline('\nsource file:\n'));
    renderBlock(source);

    process.stdout.write('\n');
}

function renderBlock(block) {

    block.forEach(part => {
        var color = part.added ? chalk.green :
            part.removed ? chalk.red : chalk.gray;

        // replace spaces with middot
        if (part.added || part.removed) {
            part.value = part.value.replace(/ /g, color.dim('·'));
            //TODO: tabs are not showing up in the diff
            // part.value = part.value.replace(/\t/g, '¯');
        }
        process.stderr.write(color(part.value));
    });
}

function countDifferingBlocks(diffs) {
    return diffs.filter(x => x.filter(y => y.value.trim() !== '').length > 1).length;
}

module.exports = ({files, ctx}) => {

    files.forEach(f => {
        if (f.blocks.length === 0) return;

        console.log(`\n${f.filePath}`);
        f.blocks.map(renderDiff);
    });

    console.log();
    console.log(`${files.length} files matched by '${ctx.pattern}' in ${ctx.cwd}`);

    files.forEach(r => {
        var count = countDifferingBlocks(r.diffs);
        if (count === 0) return;

        console.log(`${r.filePath}`);
        console.log(`>> ${count} block(s) differ`);
    });

    return '';
};