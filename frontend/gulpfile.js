'use strict';

const del = require('del');
const gulp = require('gulp');
const gutil = require('gutil');
const webpack = require('webpack');
const connect = require('gulp-connect');
const replace = require('gulp-replace');
const sequence = require('run-sequence');
const WebpackDevServer = require('webpack-dev-server');

// Start dev server
gulp.task('hot-load', (done) => {
    const webpackConfig = require('./webpack.config.js');
    const config = Object.create(webpackConfig);
    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        historyApiFallback: true,
        quiet: false,
        noInfo: false,
        stats: 'minimal'
    }).listen(3000, '0.0.0.0', function (err) {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:3000/webpack-dev-server/index.html');
    });
});

// production build
gulp.task('prod-build', (done) => {
    const webpackConfig = require('./webpack.config.production.js');
    const config = Object.create(webpackConfig);
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

// startup simple webserver for deployment build
gulp.task('connect:app', () => {
    connect.server({ root: 'app', port: 4000 });
});

// delete dist folder
gulp.task('clean:dist', () => {
    return del(['dist']);
});

// delete app folder
gulp.task('clean:app', () => {
    return del(['app']);
});

const packages = [
    { name: 'react', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/react/{version}/umd/react.production.min.js' },
    { name: 'react-dom', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/{version}/umd/react-dom.production.min.js' },
    { name: 'redux', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/redux/{version}/redux.min.js' },
    { name: 'react-bootstrap', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap/{version}/react-bootstrap.min.js' }
];

// Make a copy of index.html and replace the local node_module dependencies with the cdn urls above
gulp.task('cdn', () => {
    let stream = gulp.src('./index.html')
    for (const data of packages) {
        const version = require(`${data.name}/package.json`).version;
        const cdn = data.cdn.replace('{version}', version);
        const script = `<script src="${cdn}"></script>`
        const regx = new RegExp(`<script name="${data.name}".*`)
        stream = stream.pipe(replace(regx, script));
    }
    return stream.pipe(gulp.dest('./dist'))
});

gulp.task('copy:build', function() {
    return gulp.src('./dist/**').pipe(gulp.dest('./dist'));
});

gulp.task('build', (done) => {
    sequence('clean:dist', 'prod-build', done);
});

gulp.task('deploy', ['clean:app'], (done) => {
    sequence('prod-build', 'cdn', 'copy:build', done);
});

gulp.task('dev', ['hot-load']);
gulp.task('default', ['deploy']);
