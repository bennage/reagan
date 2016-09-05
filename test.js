const chalk = require('chalk');
const render = require('./lib/render');
const app = require('./lib/app');
const Context = require('./lib/context');

var ctx = new Context({
    cwd: './test',
    pattern: '**/*.md',
    attemptUpdate: true
});

render(ctx);

app(ctx)
    .then(_ => { process.exit(); })
    .catch(err => {
        console.dir(err);
        process.exit(1);
    });