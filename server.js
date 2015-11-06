var pg = require('pg');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');
var compression = require('compression');
var express = require('express');

var app = new express();
var port = 3000;
app.use(compression())
app.use(express.static('static'))

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

app.get("/data/:schema/:apiquery", function(req, res) {
  var apiquery = req.params.apiquery;
  var schema = req.params.schema;
  if (!schema.match(/^\w+$/)) {
    console.warn('bad schema', schema);
    res.error('bad schema', schema);
    return;
  }
  console.log('GET DATA from ', schema);
  var q;
  var params = [];
  if (apiquery === "denorm") {
    q = 'SELECT * FROM denorm';
    if (req.query.dimsetset) {
      q += ' WHERE dimsetset = $1';
      params.push(req.query.dimsetset);
    }
  }
  else if (apiquery === 'dimsetsets')
    q = 'select  dimsetset, count(*) as records, count(nullif(value,\'\')) as records_with_values ' +
        'from denorm ' +
        'where value is not null ' +
        'group by dimsetset ';

    getData("SET search_path='" + schema +"'")
      .then(function() {
        return getData(q, params);
      })
    .then(json => res.json(json));
});

app.use(function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

function pgErr(msg, err, done, reject, client) {
  console.log(msg, err.toString());
  done();
  client.end();
  reject(err.error);
}
function getData(sql, params) {
  var promise = new Promise(function(resolve, reject) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
          console.log("connection error", err);
          reject(Error("connection failed", err));
          return;
        }
        console.log(sql, params);
        var query = client.query(sql, params);
        query.on('error', function(err) {
          done();
          pgErr('getData(' + sql + ')', 
                err, done, reject, client);
          reject(Error("getData failed", err));
        })
        query.on('row', function(row, result) {
          result.addRow(row);
        });
        query.on('end', function(result) {
          console.log(result.rows.length, 'from', sql);
          //var ret = dqmunge.mungeDims(result.rows);
          resolve(result.rows);
          done();
        });
      });
    });
    return promise;
}
