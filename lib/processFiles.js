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

function validate(blocks, filePath, ctx) {

    var validations = blocks.map(block => {
        var src = block.source;
        var md = block.markdown;

        return fetch(src.url)
            .then(source => {
                var snippet = snip(source, src.firstLine, src.lastLine);

                var oldCode = ctx.ignoreWhitespace ? removeLeadingWhitespace(md.code) : md.code;
                var newCode = ctx.ignoreWhitespace ? removeLeadingWhitespace(snippet) : snippet;

                var diff = jsdiff.diffChars(oldCode, newCode);
                if (ctx.allowAbbreviations) {
                    diff = checkForAbbreviations(oldCode, newCode, diff);
                }

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
}

module.exports = ({files, ctx}) => {

    var pending = files.map(filePath => {
        return fs
            .readFile(filePath, 'utf8')
            .then(content => extractCodeBlocks(content, ctx))
            .then(blocks => validate(blocks, filePath, ctx));
    });

    return Promise
        .all(pending)
        .then(validations => {
            return {
                files: validations,
                ctx: ctx
            };
        });
};