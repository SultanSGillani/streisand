'use strict';

const gulp = require('gulp');
const gutil = require('gutil');
const webpack = require('webpack');
const connect = require('gulp-connect');
const replace = require('gulp-replace');
const WebpackDevServer = require('webpack-dev-server');

// Start dev server
console.log('HERE', {a: 1})
gulp.task('hot-load', (done) => {
    const config = require('./webpack.dev.js');
    console.log(config);
    new WebpackDevServer(webpack(config)).listen(3000, '0.0.0.0', function (err) {
        if (err) throw new gutil.PluginError('hot-load', err);
    });
});

// production build
gulp.task('prod-build', (done) => {
    const config = require('./webpack.prod.js');
    webpack(config, (error, stats) => {
        if (error) {
            console.log(error);
            return done(error);
        }
        const jsonStats = stats.toJson();
        if (jsonStats.errors.length > 0) {
            console.log(jsonStats.errors);
            return done('There were build errors');
        }
        if (jsonStats.warnings.length > 0) {
            console.log('There were', jsonStats.warnings.length, 'warning(s)...');
        }
        console.log('Successfully built project');
        done();
    });
});

// startup simple webserver for production build
gulp.task('connect', () => {
    connect.server({ port: 4000 });
});

const packages = [
    { name: 'react', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/react/{version}/umd/react.production.min.js' },
    { name: 'react-dom', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/{version}/umd/react-dom.production.min.js' },
    { name: 'redux', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/redux/{version}/redux.min.js' },
    { name: 'reactstrap', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/reactstrap/{version}/reactstrap.full.min.js' }
];

// Make a copy of index.html and replace the local node_module dependencies with the cdn urls above
gulp.task('cdn', () => {
    let stream = gulp.src('./dist/index.html')
    for (const data of packages) {
        const version = require(`${data.name}/package.json`).version;
        const cdn = data.cdn.replace('{version}', version);
        const script = `<script src="${cdn}"></script>`
        const regx = new RegExp(`<script name="${data.name}".*`)
        stream = stream.pipe(replace(regx, script));
    }
    return stream.pipe(gulp.dest('./dist'))
});

gulp.task('deploy', gulp.series('prod-build', 'cdn'));

gulp.task('dev', gulp.series('hot-load'));
gulp.task('default', gulp.series('deploy'));
