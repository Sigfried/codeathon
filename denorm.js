var fs = require('fs');
var _ = require('lodash');
var d3 = require('d3');

process.argv.slice(2).forEach(function (fileName) {
  var text = fs.readFileSync(fileName, "utf8");
  var recs = d3.csv.parse(text);
  var fields = _.keys(recs[0]);
  var newFields = fields.slice(0);
  var dimFields = _.chain(fields)
        .filter(function(f) {
          return f.match(/dim_name/);
        }).value();
  var dimValues = _.chain(fields)
        .filter(function(f) {
          return f.match(/dim_value/);
        }).value();
  newFields = _.difference(newFields, dimFields);
  newFields = _.difference(newFields, dimValues);
  newFields = _.zipObject(newFields, _.map(newFields, function() { return recs.length }));
  recs.forEach(function(rec) {
    _.chain(dimFields.length)
      .range()
      .each(function(i) {
        if (rec[dimFields[i]].length) {
          rec[rec[dimFields[i]]] = rec[dimValues[i]];
          newFields[rec[dimFields[i]]] = (newFields[rec[dimFields[i]]] || 0) + 1;
        }
        delete rec[dimFields[i]];
        delete rec[dimValues[i]];
      }).value();
      var resNameFields = rec.result_name.split(/\|\|\|/);
      _.each(resNameFields, function(f) {
        var ff = f.split(/=/);
        rec[ff[0]] = ff[1];
          newFields[ff[0]] = (newFields[ff[0]] || 0) + 1;
      });
      delete rec.result_name;
  });
  console.log(JSON.stringify(recs, null, 2));
  console.log(JSON.stringify(newFields, null, 2));

});
