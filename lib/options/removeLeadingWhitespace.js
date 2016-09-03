module.exports = function (block) {
    const leadingWhitespace = /^(\s*)/g;

    var lines = block.split('\n');

    // leading white space is determined by the first lines
    var result = leadingWhitespace.exec(lines[0]);
    if (result) {
        var lenToTrim = result[1].length;
        lines = lines.map(l => l.slice(lenToTrim));
    }

    return lines.join('\n');
};