const ora = require('ora');
const chalk = require('chalk');

const error = chalk.bold.red;
const success = chalk.bold.green;
const underline = chalk.white;
const emphasize = chalk.bold.white;

var filesFoundOutput = '';
var blocksFoundOutput = '';

function renderDiff(block) {

    var location = `lines ${block.firstLine}-${block.lastLine}`;

    if (block.diff.length === 1) {
        process.stdout.write(success('✔ '));
        process.stdout.write(location);
        process.stdout.write('\n');
        return;
    }

    process.stderr.write(error('✘ '));
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

function countDifferingBlocks(blocks) {
    return blocks.filter(x => x.diff.length > 1).length;
}

module.exports = ctx => {

    ctx.on('files.start', () => {
        const spinner = ora('scanning for files').start();

        ctx.on('files.end', files => {

            filesFoundOutput = `${emphasize(files.length)} files matched by '${emphasize(ctx.pattern)}' in ${emphasize(ctx.cwd)}`;
            spinner.text = filesFoundOutput;
            spinner.stopAndPersist('☰');
        });

    });

    ctx.on('process.start', () => {
        const spinner = ora('processing files').start();

        var fileCount = 0;
        var blockCount = 0;
        var validatedCount = 0;

        function updateSpinner() {
            blocksFoundOutput = `${emphasize(fileCount)} files with ${emphasize(validatedCount)} of ${emphasize(blockCount)} code blocks validated`;
            spinner.text = blocksFoundOutput;
        }

        ctx.on('process.foundBlocks', blocks => {
            if (blocks.length === 0) return;

            fileCount++;
            blockCount += blocks.length;
            updateSpinner();
        });

        ctx.on('process.validate', () => {
            validatedCount++;
            updateSpinner();
        });

        ctx.on('process.end', () => {
            spinner.stopAndPersist('☰');
        });

    });

    ctx.on('update.start', () => {
        const spinner = ora('updating files').start();

        ctx.on('update.end', () => {
            spinner.stopAndPersist('☰');
        });
    });

    ctx.on('end', ({files, ctx}) => {

        files.forEach(f => {
            if (f.blocks.length === 0) return;

            console.log(`\n${f.filePath}`);
            f.blocks.map(renderDiff);
        });

        console.log(emphasize('summary:'));
        console.log('\t' + filesFoundOutput);
        console.log('\t' + blocksFoundOutput);

        files.forEach(file => {
            var count = countDifferingBlocks(file.blocks);
            if (count === 0) return;

            console.log(`\n\t${file.filePath}`);
            console.log(`\t${emphasize(count)} block(s) differ`);
        });

        return { files, ctx };
    });
};