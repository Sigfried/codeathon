var express = require('express');
var pg = require('pg');

function getData() {
  var promise = new Promise(function(resolve, reject) {
      pg.connect(process.env.DATABASE_URL + '?ssl=true', function(err, client, done) {
        var q = 'SELECT * FROM dimension_set';
        var query = client.query(q);
        query.on('error', function(err) {
          done();
          reject(Error("getData failed"));
        });
        query.on('row', function(row, result) {
          result.addRow(row);
        });
        query.on('end', function(result) {
          resolve(result.rows[0]);
          done();
        });
      });
    });
    return promise;
}

//
// hot react/redux stuff
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var app = new require('express')();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get("/data", function(req, res) {
  res.json({a:1, b:2, c:3});
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
