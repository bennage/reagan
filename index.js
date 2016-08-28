const fs = require('mz/fs');
const https = require('https');
const jsdiff = require('diff');
const colors = require('colors');

const rawUrlBase = 'https://raw.githubusercontent.com/';
const sourcePattern = /<!-- source:\s*https:\/\/github.com\/([a-z\d/./-]*)#L(\d*)(?:-L(\d*))?\s*-->/ig;
const codeDelimiter = /\s*```[\w]*\s*/ig;

var markdownFiles = [
    '../azure-content-pr/includes/guidance-compute-single-vm-linux.md',
    '../azure-content-pr/includes/guidance-compute-single-vm-windows.md'
];

function httpsGet(url) {

    //TODO: cache?
    return new Promise((resolve, reject) => {
        https.get(url, res => {

            if (res.statusCode !== 200) {
                reject(new Error(`HTTP status code: ${res.statusCode}; expected 200`));
                return;
            }

            var collector = '';

            res.on('data', d => {
                collector += d;
            });

            res.on('end', () => {
                resolve(collector);
            });

        }).on('error', e => {
            reject(e);
        });
    });
}

function scanFileForCodeBlocks(file) {
    var codeblocks = [];

    var result = sourcePattern.exec(file);
    while (result !== null) {

        /* TODO: removing '/blob' from the URL is fragile; we should just look for the first instance  of '/blob' */
        const sourceFileSlug = result[1].replace('/blob', '');
        const sourceFileUrl = rawUrlBase + sourceFileSlug;

        var firstLine = result[2];
        var lastLine = result[3] || firstLine;

        codeDelimiter.lastIndex = result.index;

        var start = codeDelimiter.exec(file);
        var end = codeDelimiter.exec(file);

        var code = file.substring(start.index + start[0].length, end.index);

        var codeFirstLine = file.substr(0, start.index).split('\n').length;
        var codeLastLine = codeFirstLine + code.split('\n').length - 1;

        codeblocks.push({
            source: {
                url: sourceFileUrl,
                firstLine: firstLine,
                lastLine: lastLine
            },
            markdown: {
                code: code,
                firstLine: codeFirstLine,
                lastLine: codeLastLine
            }
        });

        result = sourcePattern.exec(file);
    }

    return codeblocks;
}

function snip(source, firstLine, lastLine) {
    var snippet = '';
    var lines = source.split('\n');
    for (var i = firstLine - 1; i < lastLine; i++) {
        snippet += lines[i] + '\n';
    }

    return snippet;
}

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

var processFiles = markdownFiles.map(filePath => {

    return fs.readFile(filePath, 'utf8')
        .then(file => {

            var codeBlocks = scanFileForCodeBlocks(file);

            var validations = codeBlocks.map(block => {
                var src = block.source;
                var md = block.markdown;

                return httpsGet(src.url)
                    .then(code => {
                        var snippet = snip(code, src.firstLine, src.lastLine);
                        var diff = jsdiff.diffChars(md.code, snippet);
                        diff.file = filePath;
                        diff.firstLine = md.firstLine;
                        diff.lastLine = md.lastLine;
                        return diff;
                    });
            });

            return Promise.all(validations)
                .then(
                diffs => {
                    return {
                        filePath: filePath,
                        diffs: diffs
                    };
                });
        });
});

Promise.all(processFiles)
    .then(results => {

        results.forEach(r => {
            r.diffs.map(renderDiff);
        });

        console.log();
        results.forEach(r => {
            console.log(`${r.filePath}`);
            console.log(`>> ${countDifferingBlocks(r.diffs)} block(s) differ`);
        });
    });