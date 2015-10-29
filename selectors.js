
import { createSelector } from 'reselect'
import _ from 'lodash';

let exp = {};
exp.recs = state => state.explorer.recs;
exp.dims = state => state.explorer.dims;

exp.filterSettings = state => state.router.location.query.filters;
exp.filteredVals = createSelector(
  exp.filterSettings,
  settings => dim => _.keys(settings[dim.field || dim])
);

exp.highlighted = state => state.router &&
    state.router.location.query.highlighted || [,];

exp.highlightedDim = createSelector(
  exp.highlighted,
  highlighted => highlighted[0]);

exp.highlightedVal = createSelector(
  exp.highlighted,
  highlighted => highlighted[1]);

exp.isDimHighlighted = createSelector(
  exp.highlightedDim,
  highlightedDim => (dim) => highlightedDim === dim.field
);
exp.isValHighlighted = createSelector(
  exp.highlightedDim,
  exp.highlightedVal,
  (highlightedDim, highlightedVal) =>
    (dim,val) => 
      highlightedDim === dim.field &&
      highlightedVal === val.toString()
);

exp.filteredRecs = createSelector(
  exp.recs, exp.filterSettings,
  (recs, filts) => {
    return _.chain(recs).filter(
      rec => {
        let flatFilts = 
          _.chain(filts)
           .map((fs,dimname) => 
                _.map(fs, (setting,val) => [dimname, val, setting]))
           .flatten()
           .filter(f=>f[2]==="true")
           .map(f=>f.slice(0,2)).value();
        return !_.some(flatFilts, ff => rec[ff[0]] === ff[1]);
      }).value();
  });

exp.dimsVals = createSelector(
  exp.filteredRecs, exp.dims,
  (recs, dims) => _.chain(dims).map(dim => 
      [dim.field, dimVals(dim,recs)]).object().value()
);

exp.dimsFoundInRecs = createSelector(
  exp.recs, recs => _.keys(Object.assign({}, ...recs))
);

export const explorer = state => {
  let es = Object.assign({}, state.explorer);
  _.each(exp, (f,k) => es[k] = f(state));
  return es;
}

// OTHER STUFF, not really selectors

export const dimVals = (dim, recs) =>
  _.supergroup(recs, dim.func || dim.field)
      .sortBy(dim.sortBy || (a=>-a.records.length))
      .addLevel(d=>isFinite(d.value) ? 'Not Missing' : 'Missing',
                {dimName: 'Missing value'});

