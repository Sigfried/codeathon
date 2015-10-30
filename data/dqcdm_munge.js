"use strict";
var pg = require('pg');
var d3 = require('d3');
var copyFrom = require('pg-copy-streams').from;
var _ = require('lodash');

(function() {
  module = module || {};

  module.exports = {
    dimNames: function(rows) {
      if (!rows || !rows.length) return [];
      var fields = _.keys(rows[0]);
      var dimFields = _.chain(fields)
            .filter(function(f) {
              return f.match(/dim_name/);
            })
            .value();
      var dimValues = _.chain(fields)
            .filter(function(f) {
              return f.match(/dim_value/);
            }).value();
      var dimNames = [];
      rows.forEach(function(row) {
        _.chain(dimFields.length)
          .range()
          .each(function(i) {
            if (row[dimFields[i]] && row[dimFields[i]].length && !row[dimFields[i]].match(/emptyfield/)) {
              //var newCol = row[dimFields[i]].replace(/ /g,'') + '_dim' + i;
              var newCol = row[dimFields[i]].replace(/ /g,'_').toLowerCase();
              if (!_.contains(dimNames, newCol))
                dimNames.push(newCol);
            }
          }).value();
      });
      return dimNames;
    },
    mungeDims: function(rows) {
      if (!rows || !rows.length) return [];
      var fields = _.keys(rows[0]);
      var dimFields = _.chain(fields)
            .filter(function(f) {
              return f.match(/dim_name/);
            })
            .value();
      var dimValues = _.chain(fields)
            .filter(function(f) {
              return f.match(/dim_value/);
            }).value();
      var dimCols = {};
      var dimNames = [];
      rows.forEach(function(row) {
        var dimsetset = [];
        _.chain(dimFields.length)
          .range()
          .each(function(i) {
            if (row[dimFields[i]] && row[dimFields[i]].length && 
                  !row[dimFields[i]].match(/emptyfield/)) {
              //var newCol = row[dimFields[i]].replace(/ /g,'') + '_dim' + i;
              var newCol = row[dimFields[i]].replace(/ /g,'_').toLowerCase();//.replace(/^/,'d' + i + '_');
              if (newCol.match(/table/i))
                newCol = 'd_' + newCol;
              dimsetset.push(newCol);
              row[newCol] = row[dimValues[i]];
              dimCols[newCol] = (dimCols[newCol] || 0) + 1;
              if (!_.contains(dimNames, newCol))
                dimNames.push(newCol);
            }
            delete row[dimFields[i]];
            delete row[dimValues[i]];
            row.dimsetset = dimsetset.join(',');
          }).value();
      });
      console.log(rows.length, 'rows');
      console.log(dimCols);
      return {dimensionNames: dimNames, dimensions: rows};
    },
    mungeResults: function(rows) {
      if (!rows || !rows.length) return [];
      var resCols = {};
      rows.forEach(function(row) {
        var resNameFields = row.result_name.split(/\|\|\|/);
        _.each(resNameFields, function(f) {
          var ff = f.split(/=/);
          var newCol = ff[0]//.replace(/^/,'r_');
          row[newCol] = ff[1];
            resCols[newCol] = (resCols[newCol] || 0) + 1;
        });
        //delete row.result_name;
      });
      return {resCols: _.keys(resCols), results: rows};
    },
  }

  function getData(q, client, done, params, onRow) {
    var promise = new Promise(function(resolve, reject) {
      var query = client.query(q, params);
      query.on('error', function(err) {
        pgErr('getData(' + q + ')', 
              err, done, reject, client);
      })
      query.on('row', function(row, result) {
        result.addRow(row);
      });
      query.on('end', function(result) {
        resolve(result);
        done();
      });
    });
    return promise;
  }
  function makeTable(table, dimnames, client, done, recs) {
    var promise = new Promise(function(resolve, reject) {
      var cols = dimnames.map(
        dimname => dimname + ' text').join(', ');
      var q = 'CREATE TABLE ' + table + ' (' + cols + ')';
      console.log(q);
      var query = client.query(q);
      query.on('error', function(err) {
        pgErr('makeTable ' + table + '(' + dimnames + ')', 
              err, done, reject, client);
      })
      query.on('end', function(result) {
        resolve(recs); // just passing this along
        //resolve(result);
        done();
      });
    });
    return promise;
  }
  function populateDimReg(table, recs, client, done) {
    var promise = new Promise(function(resolve, reject) {
      var stream = client.query(copyFrom('COPY ' + table + ' FROM STDIN'));
      var tsv = d3.tsv.format(recs);
      console.log(tsv.substr(0,500));
      var rowEmitCount = 0;
      stream.on('row', function() {
        rowEmitCount++;
      });
      stream.write(Buffer(tsv));
      stream.end();
      stream.on('end', function() {
        resolve();
        done();
      });
    });
    return promise;
  }
  function pgErr(msg, err, done, reject, client) {
    console.log(msg, err.toString());
    done();
    client.end();
    reject(err.error);
  }
  function newData() {
    console.log('pg: ', process.env.DATABASE_URL);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) {
        console.log("connection error", err);
        reject(Error("connection failed", err));
        return;
      }
      var finalCols = [];
      var search_path = (process.argv[2] || 'public');
      console.log('search_path:', search_path);
      getData("SET search_path='" + search_path +"'", client, done)
        .then(function() {
          return getData('SELECT \'\'::text AS dimsetset, * FROM dimension_set', client, done)
        })
        .then(function(result) {
          var json = module.exports.mungeDims(result.rows);
          //return json;
          var dimnames = json.dimensionNames;
          finalCols = finalCols.concat(dimnames.map((d)=>'d.'+d));
          var recs = json.dimensions;
          dimnames.unshift('set_id');
          dimnames.unshift('dimsetset');
          finalCols.unshift('dimsetset');
          return makeTable('dimensions_regular', dimnames,client,done, recs);
        })
        .then(function(recs) {
          console.log(recs.slice(0,3));
          return populateDimReg('dimensions_regular',recs,client,done)
        })
        .then(function() {
          return getData('SELECT * FROM result', client, done)
        })
        .then(function(result) {
          var json = module.exports.mungeResults(result.rows);
          return json;
        })
        .then(function(json) {
          finalCols.push('value');
          var resCols = json.resCols.map((r)=>'result_'+r);
          finalCols = finalCols.concat(resCols.map((r)=>'r.'+r));
          resCols = ['value','result_name_orig','set_id','measure_id'].concat(resCols);
          var recs = json.results;
          return makeTable('results_regular', resCols,client,done)
            .then(function() {
              return populateDimReg('results_regular',recs,client,done)
            })
        })
        .then(function() {
          finalCols = finalCols.concat([
            'm.name as measure_name',
            'm.description as measure_desc',
            'm.source_name','m.measure_id','d.set_id' ]);

          var q = 'CREATE TABLE denorm AS SELECT \n' +
                    finalCols.join(',') + ' \n' +
                  'FROM results_regular r \n' +
                  'JOIN dimensions_regular d ON r.set_id = d.set_id \n' +
                  'JOIN measure m ON r.measure_id = m.measure_id::text;\n';
          console.log(q);
          return getData(q, client, done);
        })
        .then(function() {
          console.log('done');
          client.end();
          sys.exit();
        });
    });
  };
  newData();
})();
  /*
  function newDataNew() {
    console.log('pg: ', process.env.DATABASE_URL);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) {
        console.log("connection error", err);
        reject(Error("connection failed", err));
        return;
      }
      var finalCols = [];
      var search_path = (process.argv[2] || 'public');
      console.log('search_path:', search_path);
      getData("SET search_path='" + search_path +"'", client, done)
        .then(function() {
          return getData('SELECT * FROM dimension_set', client, done)
        })
        .then(function(result) {
          var json = module.exports.mungeDims(result.rows);
          dimnames.unshift('dimsetset');
          finalCols = finalCols.concat(dimnames.map((d)=>'d.'+d));
          dimnames.unshift('set_id');
          return makeTable('dimensions_regular', dimnames,client,done)
          /*
          return json;
          var dimNames = module.exports.dimNames(result.rows);
          //console.log(dimNames);
          process.exit();
          var dimnames = json.dimensionNames;
          var recs = json.dimensions;
          * /
        })
        .then(function() {
          // again
          return getData('SELECT * FROM dimension_set', client, done)
        })
        .then(function() {
          return populateDimReg('dimensions_regular',recs,client,done)
        })
        .then(function() {
          return getData('SELECT * FROM result', client, done)
        })
        .then(function(result) {
          var json = module.exports.mungeResults(result.rows);
          return json;
        })
        .then(function(json) {
          finalCols.push('value');
          var resCols = json.resCols.map((r)=>'result_'+r);
          finalCols = finalCols.concat(resCols.map((r)=>'r.'+r));
          resCols = ['value','result_name_orig','set_id','measure_id'].concat(resCols);
          var recs = json.results;
          return makeTable('results_regular', resCols,client,done)
            .then(function() {
              return populateDimReg('results_regular',recs,client,done)
            })
        })
        .then(function() {
          finalCols = finalCols.concat([
            'm.name as measure_name',
            'm.description as measure_desc',
            'm.source_name','m.measure_id','d.set_id' ]);

          var q = 'CREATE TABLE denorm AS SELECT \n' +
                    finalCols.join(',') + ' \n' +
                  'FROM results_regular r \n' +
                  'JOIN dimensions_regular d ON r.set_id = d.set_id \n' +
                  'JOIN measure m ON r.measure_id = m.measure_id::text;\n';
          console.log(q);
          return getData(q, client, done);
        })
        .then(function() {
          console.log('done');
          client.end();
          sys.exit();
        });
    });
  };
  */
