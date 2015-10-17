var pg = require('pg');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var app = new require('express')();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});

app.get("/data/:apiquery", function(req, res) {
  console.log('GET DATA');
  var apiquery = req.params.apiquery;
  if (apiquery === "all")
  getData('SELECT * FROM denorm').
    then(json => res.json(json));
});

app.use(function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

function getData(sql) {
  var promise = new Promise(function(resolve, reject) {
      console.log('pg: ', process.env.DATABASE_URL);
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
          console.log("connection error", err);
          reject(Error("connection failed", err));
          return;
        }
        //var q = 'SELECT * FROM dimension_set';
        var query = client.query(sql);
        query.on('error', function(err) {
          done();
          reject(Error("getData failed"));
        });
        query.on('row', function(row, result) {
          result.addRow(row);
        });
        query.on('end', function(result) {
          //var ret = dqmunge.mungeDims(result.rows);
          resolve(result.rows);
          done();
        });
      });
    });
    return promise;
}
