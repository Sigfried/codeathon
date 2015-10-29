
import { createSelector } from 'reselect'
import _ from 'lodash';

let exp = {};

export const recs = state => state.explorer.recs;
export const dims = state => state.explorer.dims;
export const filterSettings = state => state.router.location.query.filters;

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
  recs, filterSettings,
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
  exp.filteredRecs, dims,
  (recs, dims) => {
    return _.chain(dims).map(dim => 
                        [dim.field, dimVals(dim,recs)]).object().value()
                        }
);

exp.dimsFoundInRecs = createSelector(
  recs, recs => _.keys(Object.assign({}, ...recs))
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

