const https = require('https');

module.exports = function (url) {

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
};