const fs = require('mz/fs');
const https = require('https');
const jsdiff = require('diff');

const rawUrlBase = 'https://raw.githubusercontent.com/';
const sourcePattern = /<!--\s*source:\s*https:\/\/github.com\/([a-z\d/./-]*)#L(\d*)(?:-L(\d*))?\s*-->/ig;
const codeDelimiter = /[ \t]*```([\w]*)\s*\n/ig;

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

        // remove a comment indentifying the language
        var language = start[1];
        var language_regex = new RegExp('^[#\\\\]*\\s*' + language + '$', 'igm');
        var languageIdComment = language_regex.exec(code);
        if (languageIdComment) {
            code = code.replace(languageIdComment[0], '');
        }

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

module.exports = function (markdownFiles) {

    var pending = markdownFiles.map(filePath => {

        return fs
            .readFile(filePath, 'utf8')
            .then(file => {
                var codeBlocks = scanFileForCodeBlocks(file);
                var validations = codeBlocks.map(block => {
                    var src = block.source;
                    var md = block.markdown;

                    return httpsGet(src.url)
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
                    .then(
                    diffs => {
                        return {
                            filePath: filePath,
                            diffs: diffs
                        };
                    });
            });
    });

    return Promise.all(pending);
};