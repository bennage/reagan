const fs = require('mz/fs');
const jsdiff = require('diff');
const fetch = require('./fetch');
const extractCodeBlocks = require('./extractCodeBlocks');

function snip(source, firstLine, lastLine) {
    var snippet = '';
    var lines = source.split('\n');
    for (var i = firstLine - 1; i < lastLine; i++) {
        snippet += lines[i] + '\n';
    }

    return snippet;
}

function removeLeadingWhitespace(block) {
    const leadingWhitespace = /^(\s*)/g;

    var lines = block.split('\n');

    // leading white space is determined by the first lines
    var result = leadingWhitespace.exec(lines[0]);
    if (result) {
        lines = lines.map(l => l.slice(result[1].length));
    }

    return lines.join('\n');
}

module.exports = function (markdownFiles) {

    var pending = markdownFiles.map(filePath => {

        return fs
            .readFile(filePath, 'utf8')
            .then(file => {
                var codeBlocks = extractCodeBlocks(file);
                var validations = codeBlocks.map(block => {
                    var src = block.source;
                    var md = block.markdown;

                    return fetch(src.url)
                        .then(code => {
                            var snippet = snip(code, src.firstLine, src.lastLine);

                            var oldCode = removeLeadingWhitespace(md.code);
                            var newCode = removeLeadingWhitespace(snippet);

                            var diff = jsdiff.diffChars(oldCode, newCode);
                            diff.file = filePath;
                            diff.firstLine = md.firstLine;
                            diff.lastLine = md.lastLine;
                            return diff;
                        });
                });

                return Promise.all(validations)
                    .then(diffs => {
                        return {
                            filePath: filePath,
                            diffs: diffs
                        };
                    });
            });
    });

    return Promise.all(pending);
};