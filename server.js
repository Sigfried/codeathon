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
app.use(express.static('data'));

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
  console.log('request', req.url);
  var apiquery = req.params.apiquery;
  var schema = req.params.schema;
  if (!schema.match(/^\w+$/)) {
    console.warn('bad schema', schema);
    res.error('bad schema', schema);
    return;
  }
  var q;
  var params = [];
  if (apiquery === "denorm") {
    q = 'SELECT * ' +
        'from ' + schema + '.denorm ';
    if (req.query.dss) {
      q += ' WHERE dimsetset = $1';
      params.push(req.query.dss);
    }
  } else if (apiquery === 'icicle') {
    q = 'select dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6, count(*) as cnt, ' +
          'count(distinct(measure_name)) as measures ' +
          'from ' + schema + '.denorm ' +
          'group by dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6 ' +
          'order by 1,2,3,4,5,6';
  } else if (apiquery === 'dimsetsets')
    //q = 'select  dimsetset, count(*) as records, count(nullif(value,\'\')) as records_with_values ' +
    q = 'select  dimsetset, count(*) as records, ' +
        'count(distinct measure_id) as measures ' +
        //', count(distinct measure_id) as measures, ' +
        //'count(distinct set_id) as sets ' +
        'from ' + schema + '.denorm ' +
        'where value is not null ' +
        'group by dimsetset ';
  else if (apiquery === 'dimsetset') {
    var dss = req.query.dss || '';
    console.log('dimsetset ' + dss);
    if (!dss.match(/^[\w,]*$/)) {
      console.warn('bad dss', dss);
      res.error('bad dss: ' + dss);
      return;
    }
    var cols = dss.split(/,/);
    q = 'select ' +
        cols.map(c => 'count(distinct ' + c + ') as ' + c).join(',') +
        ', count(*) as records, count(distinct measure_id) as measures, ' +
        'count(distinct set_id) as sets ' +
        'from ' + schema + '.denorm ' +
        'where dimsetset = $1 ';
    params.push(dss);
  }
  getData(q, params)
    .then(json => {
      console.log(req.url, json.length, 'results');
      return json;
    })
    .then(json => res.json(json));

  /*
  getData("SET search_path='" + schema +"'")
    .then(function() {
      return getData(q, params);
    })
    .then(json => {
      console.log(req.url, json.length, 'results');
      return json;
    })
    .then(json => res.json(json));
    */
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
  console.log(sql, params && params.length && params || '');
  var promise = new Promise(function(resolve, reject) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
          console.log("connection error", err);
          reject(Error("connection failed", err));
          return;
        }
        //console.log(sql, params);
        var query = client.query(sql, params);
        query.on('error', function(err) {
          done();
          pgErr('getData(' + sql + ': ' + (params&&params||'') + ')',
                err, done, reject, client);
          reject(Error("getData failed", err));
        })
        query.on('row', function(row, result) {
          result.addRow(row);
        });
        query.on('end', function(result) {
          //console.log(result.rows.length, 'from', sql);
          //var ret = dqmunge.mungeDims(result.rows);
          resolve(result.rows);
          done();
        });
      });
    });
    return promise;
}
