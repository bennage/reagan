const fs = require('mz/fs');

module.exports = ({files, ctx}) => {

    if (!ctx.attemptUpdate) return { files, ctx };

    var updates = files.map(file => {
        var blocks = file.blocks;
        return fs
            .readFile(file.filePath, 'utf8')
            .then(data => {

                var lines = data.split('\n');
                var buffer = [];
                var lastLine = 0;

                blocks.forEach(block => {

                    for (var i = lastLine; i < block.firstLine; i++) {
                        buffer.push(lines[i]);
                    }

                    lastLine = block.lastLine;

                    var newLines = block.diff
                        .filter(x => !x.removed)
                        .map(x => x.value)
                        .join('')
                        .split('\n');
                    newLines.pop();
                    buffer = buffer.concat(newLines);
                });

                for (var i = lastLine; i < lines.length; i++) {
                    buffer.push(lines[i]);
                }

                var newText = buffer.join('\n');

                return fs.writeFile(file.filePath, newText, 'utf8');
            });
    });

    return Promise.all(updates)
        .then(_ => {
            return { files, ctx };
        });
};