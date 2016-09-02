const colors = require('colors');

function renderDiff(block) {

    var location = `lines ${block.firstLine}-${block.lastLine}`;

    if (block.diff.length === 1) {
        process.stdout.write('✓ '.green);
        process.stdout.write(location);
        process.stdout.write('\n');
        return;
    }

    process.stderr.write('✗ '.red);
    process.stderr.write(location);
    process.stderr.write('\n');

    block.diff.forEach(part => {
        // green for additions, red for deletions 
        // grey for common parts 
        var color = part.added ? 'green' :
            part.removed ? 'red' : 'grey';

        // replace spaces with middot
        if (part.added || part.removed) {
            part.value = part.value.replace(/ /g, '·');
            //TODO: tabs are not showing up in the diff
            // part.value = part.value.replace(/\t/g, '¯');
        }
        process.stderr.write(part.value[color]);
    });
}

function countDifferingBlocks(diffs) {
    return diffs.filter(x => x.filter(y => y.value.trim() !== '').length > 1).length;
}

module.exports = ({files, context}) => {

    files.forEach(f => {
        if (f.blocks.length === 0) return;

        console.log(`>> ${f.filePath}`);
        f.blocks.map(renderDiff);
    });

    console.log();
    console.log(`${files.length} files matched by '${context.pattern}' in ${context.cwd}`);

    files.forEach(r => {
        var count = countDifferingBlocks(r.diffs);
        if (count === 0) return;

        console.log(`${r.filePath}`);
        console.log(`>> ${count} block(s) differ`);
    });

    return '';
};