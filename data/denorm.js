var fs = require('fs');
var _ = require('lodash');
var d3 = require('d3');
require('supergroup');

process.argv.slice(2).forEach(function (fileName) {
  var text = fs.readFileSync(fileName, "utf8");
  var recs = d3.csv.parse(text);
  var fields = _.keys(recs[0]);
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
  var resCols = {};
  recs.forEach(function(rec) {
    _.chain(dimFields.length)
      .range()
      .each(function(i) {
        if (rec[dimFields[i]].length) {
          var newCol = rec[dimFields[i]].replace(/ /g,'') + '_dim' + i;
          rec[newCol] = rec[dimValues[i]];
          dimCols[newCol] = (dimCols[newCol] || 0) + 1;
        }
        delete rec[dimFields[i]];
        delete rec[dimValues[i]];
      }).value();
      var resNameFields = rec.result_name.split(/\|\|\|/);
      _.each(resNameFields, function(f) {
        var ff = f.split(/=/);
        var newCol = ff[0];
        rec[newCol] = ff[1];
          resCols[newCol] = (resCols[newCol] || 0) + 1;
      });
      delete rec.result_name;
  });
  var all = {
    dimCols: dimCols,
    resCols: resCols,
    //dimNames: dimNames,
    data: recs,
  };
  console.log(JSON.stringify(all, null, 2));
  return;
  console.log('dimCols',JSON.stringify(dimCols, null, 2));
  console.log('resultCols', JSON.stringify(resCols, null, 2));
  var resNames = _.supergroup(recs, ['name','unit']);
  console.log('resultNames',_.invoke(resNames.leafNodes(), "namePath"));
  var dimVals = _.supergroup(recs, [ 
    //"HospitalName_dim3",
    //"PatientType_dim2",
    //"IssuePeriod_dim1",
    "DataElement_dim0",
    "value",
    //"name", 
    //"unit",
  ]);
  //console.log('vals', dimVals.join('\n'));
  console.log('dimNames',
    _.map(dimVals.leafNodes(), function(dimval) {
      return [dimval.namePath(), 
        //_.pluck(dimval.records,'value').join(',')
      ];
    }));

});
