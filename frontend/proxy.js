// This script is intended only to be used in development to proxy requests.
// In production the website should be hosted on the server itself so no proxying should be needed.
// Pass the url to the server as an argument to the script: `node proxj.js "http://my.domain.com:8000"`
var express = require('express');
var request = require('request');

if (!process.argv || process.argv.length < 3) {
    console.log('Please specify a url to proxy to.')
    return 0;
}

var proxyUrl = process.argv[2];
var port = process.argv.length >= 4 ? process.argv[3] : '8000';

var app = express();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use('/', function (req, res) {
    var url = proxyUrl + req.url;
    console.log(req.method, url);

    if (req.method === 'OPTIONS') {
        return res.send();
    }
    req.pipe(request({ qs: req.query, uri: url }), function (error, response, body) {
        if (error) {
            console.error(error);
        }
    }).pipe(res);
});

app.listen(port, function () {
    console.log(`Listening on port ${port} to proxy all requests to:`, proxyUrl);
});
