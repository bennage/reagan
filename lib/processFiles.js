const fs = require('mz/fs');
const jsdiff = require('diff');
const fetch = require('./fetch');
const extractCodeBlocks = require('./extractCodeBlocks');

const removeLeadingWhitespace = require('./options/removeLeadingWhitespace');
const checkForAbbreviations = require('./options/checkForAbbreviations');

function snip(source, firstLine, lastLine) {
    var snippet = '';
    var lines = source.split('\n');
    for (var i = firstLine - 1; i < lastLine; i++) {
        snippet += lines[i] + '\n';
    }

    return snippet;
}

module.exports = ({files, context}) => {

    var pending = files.map(filePath => {

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
                            diff = checkForAbbreviations(oldCode, newCode, diff);

                            return {
                                diff: diff,
                                firstLine: md.firstLine,
                                lastLine: md.lastLine
                            };
                        });
                });

                return Promise
                    .all(validations)
                    .then(blocks => {
                        return {
                            filePath: filePath,
                            blocks: blocks
                        };
                    });
            });
    });

    return Promise
        .all(pending)
        .then(files => {
            return {
                files: files,
                context: context
            };
        });
};