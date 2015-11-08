"use strict";
var pg = require('pg');
var d3 = require('d3');
var copyFrom = require('pg-copy-streams').from;
var _ = require('lodash');

(function() {
  function getData(q, client, done, params, onRow) {
    var promise = new Promise(function(resolve, reject) {
      try {
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
      } catch(e) {
        console.error(e);
      }
    });
    return promise;
  }
  function pgErr(msg, err, done, reject, client) {
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
      var finalCols = [];
      var search_path = (process.argv[2] || 'public');
      getData("SET search_path='" + search_path +"'", client, done)
        .then(function() {
          try {
            var q = 'select  dimsetset, count(*) as records, count(nullif(value,\'\')) as records_with_values ' +
                ', count(distinct measure_id) as measures, ' +
                'count(distinct set_id) as sets ' +
                'from denorm ' +
                'where value is not null ' +
                'group by dimsetset ';
            return getData(q, client, done);
          } catch(e) {
            console.error(e)
            process.exit();
          }
        })
        .then(function(result) {
          try {
            result.rows.forEach(row => {
              var dims = row.dimsetset.split(',');
              dims.forEach((dim,i) => {
                row['dim_name_' + (i+1)] = dim;
              });
            })
            console.log(JSON.stringify(result.rows, null, 2));
          } catch(e) {
            console.error(e)
            process.exit();
          }
        })
        .then(function() {
          client.end();
          sys.exit();
        });
    });
  };
  newData();
})();
