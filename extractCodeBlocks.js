const sourcePattern = /<!--\s*source:\s*https:\/\/github.com\/([a-z\d/./-]*)#L(\d*)(?:-L(\d*))?\s*-->/ig;
const codeDelimiter = /[ \t]*```([\w]*)\s*\n/ig;
const rawUrlBase = 'https://raw.githubusercontent.com/';

function removeLanguageComment(language, code) {
    // TODO: there should be an option to disable this
    // remove a comment indentifying the language
    const language_regex = new RegExp('^\\s*[#/\]*\\s*' + language + '\n', 'igm');
    var languageIdComment = language_regex.exec(code);
    return (languageIdComment !== null) 
        ? code.replace(languageIdComment[0], '')
        : code;
}

module.exports = function (file) {

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
        code = removeLanguageComment(start[1], code)

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
};