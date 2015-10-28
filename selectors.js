
import { createSelector } from 'reselect'
import _ from 'lodash';

export const recs = state => state.explorer.recs;
export const dims = state => state.explorer.dims;
export const filterSettings = state => state.router.location.query.filters;

export const filteredRecs = createSelector(
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
export const dimsVals = createSelector(
  filteredRecs, dims,
  (recs, dims) => {
    return _.chain(dims).map(dim => 
                        [dim.field, dimVals(dim,recs)]).object().value()
                        }
);

export const dimVals = (dim, recs) =>
  _.supergroup(recs, dim.func || dim.field)
      .sortBy(dim.sortBy || (a=>-a.records.length))
      .addLevel(d=>isFinite(d.value) ? 'Not Missing' : 'Missing',
                {dimName: 'Missing value'});

export const dimsFoundInRecs = createSelector(
  recs, recs => _.keys(Object.assign({}, ...recs))
  );

export const explorer = state => 
  Object.assign({}, state.explorer,
    ({
      filteredRecs: filteredRecs(state),
      dimsVals: dimsVals(state),
      dimsFoundInRecs: dimsFoundInRecs(state)
    }));
