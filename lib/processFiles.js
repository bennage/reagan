const fs = require('mz/fs');
const jsdiff = require('diff');
const fetch = require('./fetch');
const extractCodeBlocks = require('./extractCodeBlocks');

const abbreviator = /^\s*\.\.\.\s*/gm;

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
        var lenToTrim = result[1].length;
        lines = lines.map(l => l.slice(lenToTrim));
    }

    return lines.join('\n');
}

function checkForAbbreviations(oldCode, newCode, diff) {

    // this works best in the positive case where the sample matches the source
    // in the negative case, it requires manually intervention
    var segments = oldCode.split(abbreviator);

    // if an abbreviator is not found, 
    // return the original diff
    if (segments.length === 1) return diff;

    // if the new code does not have exact matches for _everthing_ in the abbreviated code, 
    // return an annotated diff
    var segments_match = segments.every(s => newCode.indexOf(s) !== -1);
    if (!segments_match) {
        return diff;
    }

    // if all segments have a match,
    // create a new diff communicating no differences
    return [{
        value: oldCode,
        count: oldCode.length
    }];
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