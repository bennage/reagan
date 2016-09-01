var listFiles = require('./listFiles');

listFiles(['/Users/bennage/dev/azure-content-pr/articles/guidance'])
    .then(files => {
        console.log(files.length);
    });