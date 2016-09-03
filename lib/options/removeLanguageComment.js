module.exports = function (language, code) {
    // TODO: there should be an option to disable this
    // remove a comment indentifying the language
    const language_regex = new RegExp('^\\s*[#/\]*\\s*' + language + '\n', 'igm');
    var languageIdComment = language_regex.exec(code);
    return (languageIdComment !== null) ? code.replace(languageIdComment[0], '')
        : code;
};
