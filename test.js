var listFiles = require('./listFiles');

listFiles('~/dev/azure-content-pr/articles/','**/*.md')
    .then(files => {
        console.dir(files);
        console.log(files.length);
    });