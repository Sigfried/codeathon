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
              //var newCol = module.exports.fixColName(row[dimFields[i]]);
              var col = row[dimFields[i]];
              if (!_.contains(dimNames, col))
                dimNames.push(col);
            }
          }).value();
      });
      dimNames = dimNames.concat(dimFields);
      return dimNames;
    },
    newDimRows: function(dimNameFixes, rows) {
      try {
        return rows.map(row=>module.exports.fixDimRow(dimNameFixes, row));
      } catch(e) {
        console.error(e);
        process.exit();
      }
    },
    fixColName: function(s) {
      var col = s.replace(/ /g,'_').toLowerCase();
      if (['table','all'].indexOf(col) > -1)
        col = 'd_' + col;
      return col;
    },
    fixDimRow: function(dimNameFixes, row) {
      var newRow = {dimsetset:'', set_id: row.set_id};
      var dimsetset = [];
      //console.log('raw row\n', JSON.stringify( row, null, 2));
      _.range(6).forEach(function(i) {
        var dn = 'dim_name_' + (i + 1), 
            dv = 'dim_value_' + (i + 1);
        if (row[dn] && row[dn].length && !row[dn].match('emptyfield')) {
          //console.log(dn, row[dn], row[dv]);
          var dimNameFixed = dimNameFixes[row[dn]];
          newRow[dimNameFixed] = row[dv];
          dimsetset.push(dimNameFixed);
        }
      });
      _.each(dimNameFixes, function(fixed, orig) {
        if (! (fixed in newRow))
          newRow[fixed] = null;
      });
      _.range(6).forEach(function(i) {
        var dn = 'dim_name_' + i, dv = 'dim_value_' + i;
        if (row[dn] && row[dn].length && !row[dn].match('emptyfield')) {
          newRow[dn] = row[dn];
        }
      });
      newRow.dimsetset = dimsetset.join(',');
      //console.log(dimsetset, JSON.stringify(newRow, null, 2));
      return newRow;
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
        var num = parseFloat(row.value);
        if (_.isNumber(num) && isFinite(num))
          row.value = num;
        else
          row.value = '\\N';
      });
      return {resCols: _.keys(resCols), results: rows};
    },
  }

  function getData(q, client, done, params, onRow) {
    var promise = new Promise(function(resolve, reject) {
      console.log(q);
      try {
        var query = client.query(q, params);
        console.log('query issued');
        query.on('error', function(err) {
          pgErr('getData(' + q + ')', 
                err, done, reject, client);
        })
        query.on('row', function(row, result) {
          //console.log('row', row);
          result.addRow(row);
        });
        query.on('end', function(result) {
          resolve(result);
          console.log(q, 'finished');
          done();
        });
      } catch(e) {
        console.error(e);
      }
    });
    return promise;
  }
  function makeTable(table, dimnames, client, done, passthrough, coltypes) {
    coltypes = coltypes || {};
    try {
      console.log('maketable', table, dimnames);
      var promise = new Promise(function(resolve, reject) {
        var cols = dimnames.map(
                        dimname => dimname + ' ' + (coltypes[dimname] || 'text'))
                      .join(', ');
        var q = 'CREATE TABLE ' + table + ' (' + cols + ')';
        console.log(q);
        var query = client.query(q);
        query.on('error', function(err) {
          pgErr('makeTable ' + table + '(' + dimnames + ')', 
                err, done, reject, client);
        })
        query.on('end', function(result) {
          resolve(passthrough); // just passing this along
          done();
        });
      });
      return promise;
    } catch(e) {
      console.error(e);
      process.exit();
    }
  }
  function populateDimReg(table, recs, client, done, dimNames) {
    var promise = new Promise(function(resolve, reject) {
      batch(0, 100000);
      
      function batch(start, end) {
        var batchrecs = recs.slice(start,end);
        start = end;
        end = start + 100000;
        console.log('about to copy ' + batchrecs.length + ' starting at ' + start + ' recs into', table);
        try {
          var tsv = d3.tsv.formatRows(batchrecs.map(function(rec) {
            return dimNames && 
                  dimNames.map(function(dn) {
                      return (dn in rec && rec[dn] != null) ? rec[dn] : '\\N';
                  }) ||
                  _.values(rec);
            
          }));
          console.log(tsv);
          //console.log('tsv.substr(0,500):\n=======================\n', tsv.substr(0,500), '\n===================\n');
          if (end <= recs.length) {
            batch(start, end);
          }
          return;
        } catch(e) {
          console.log('generate tsv failed', e);
          process.exit();
        }
        try {
          var rowEmitCount = 0;
          var stream = client.query(copyFrom('COPY ' + table + ' FROM STDIN'));
          stream.on('row', function() {
            rowEmitCount++;
          });
          console.log('write buffer');
          stream.write(Buffer(tsv));
          stream.end();
          console.log('end write buffer');
          stream.on('end', function() {
            console.log('on end...');
            if (end <= recs.length)
              setTimeout(function() { batch(start, end); }, 10000);
            else {
              console.log('resolving');
              resolve();
              console.log('done-ing...');
              done();
            }
          });
        } catch(e) {
          console.log('copy tsv failed', e);
          process.exit();
        }
      }
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
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) {
        console.log("connection error", err);
        reject(Error("connection failed", err));
        return;
      }
      var finalCols = ['dimsetset'];
      var search_path = (process.argv[2] || 'public');
      console.log('search_path:', search_path);
      getData("SET search_path='" + search_path +"'", client, done)
        .then(function() {
          try {
            var q = 'SELECT distinct \'\'::text AS dimsetset, * FROM dimension_set d\n';
            /*
            if (search_path === 'pcornet_dq')
              q += 'join result r on r.set_id = d.set_id \n' +
                  'join measure m on r.measure_id = m.measure_id \n' +
                  "where m.name like '%'||'date'||'%' or value>0";
            */
            return getData(q, client, done);
          } catch(e) {
            console.error(e)
            process.exit();
          }
        })
        .then(function(result) {
          try {
            var dimNames = module.exports.dimNames(result.rows);
            dimNames.unshift('set_id');
            dimNames.unshift('dimsetset');

            var dimNameFixes = _.chain(dimNames)
                        .filter(function(dn) { return dn !== 'dimsetset'; })
                        .map(function(dn) { 
                          return [dn, module.exports.fixColName(dn)];
                        })
                        .object()
                        .value();
            console.log(JSON.stringify(dimNameFixes,null,2));
            finalCols = finalCols.concat(_.values(dimNameFixes).map((d)=>'d.'+d));

            var recs = module.exports.newDimRows(dimNameFixes, result.rows);
            console.log('5 recs:',recs.slice(0,5));
            /*
            process.exit();
            //var dimnames = json.dimensionNames;
            var recs = json.dimensions;
            var json = module.exports.mungeDims(result.rows);
            //return json;
            var dimnames = json.dimensionNames;
            var recs = json.dimensions;
            dimnames.unshift('set_id');
            dimnames.unshift('dimsetset');
            finalCols.unshift('dimsetset');
            console.log('dimnames', dimnames, '\nrecs',recs.slice(0,3));
            */
            var dimNames = _.values(dimNameFixes);
            dimNames.unshift('dimsetset');
            return makeTable('dimensions_regular', dimNames,
                              client,done, [recs, dimNames],
                           {set_id:'integer'})
          } catch(e) {
            console.error(e)
            process.exit();
          }
        })
        .then(function(passthrough) {
          var recs = passthrough[0];
          var dimNames = passthrough[1];
          try {
            return populateDimReg('dimensions_regular',recs,client,done, dimNames)
          } catch(e) {
            console.log('error populating dimreg', e);
          }
        })
        .then(function() {
          return getData('SELECT * FROM result', client, done)
        })
        .then(function(result) {
          var json = module.exports.mungeResults(result.rows);
          return json;
        })
        .then(function(json) {
          finalCols.push('r.value');
          var resCols = json.resCols.map((r)=>'result_'+r);
          finalCols = finalCols.concat(resCols.map((r)=>'r.'+r));
          resCols = ['value','result_name_orig','set_id','measure_id'].concat(resCols);
          var recs = json.results;
          return makeTable('results_regular', resCols,client,done, null, 
                           {value:'numeric', set_id:'integer', measure_id:'integer'})
            .then(function() {
              return populateDimReg('results_regular',recs,client,done)
            })
        })
        .then(function() {
          finalCols = finalCols.concat([
            'r.result_name_orig',
            'm.name as measure_name',
            'm.description as measure_desc',
            'm.source_name','m.measure_id' ]);

          var q = 'CREATE TABLE denorm AS SELECT \n' +
                    finalCols.join(',') + ' \n' +
                  'FROM results_regular r \n' +
                  'JOIN dimensions_regular d ON r.set_id = d.set_id \n' +
                  'JOIN measure m ON r.measure_id = m.measure_id \n' +
                  'WHERE r.value IS NOT NULL';
          return getData(q, client, done);
        })
        .then(function() {
          console.log('done');
          client.end();
          sys.exit();
        });
    });
  };
  if (process.argv[2])
    newData();
})();
