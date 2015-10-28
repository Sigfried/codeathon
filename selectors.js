
import { createSelector } from 'reselect'

export const recs = state => state.explorer.recs;
export const dims = state => state.explorer.dims;
export const filterSettings = state => state.router.location.query.filters;
import _ from 'lodash';

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
/*
export const dimVals = createSelector(
    filteredRecs,
    recs => dim => {
        let sg = _.supergroup(recs, dim.func || dim.field);
        if (sg.length)
          sg = sg.sortBy(dim.sortBy || (a=>-a.records.length));
        return sg;
      }
  );
*/
export const dimVals = createSelector(
  filteredRecs, dims,
  (recs, dims) => {
    return _.chain(dims).map(
            dim => {
              let sg = _.supergroup(recs, dim.func || dim.field);
              if (sg.length)
                sg = sg.sortBy(dim.sortBy || (a=>-a.records.length));
              sg.addLevel(
                d=>isFinite(d.value) ? 'Not Missing' : 'Missing',
                {dimName: 'Missing value'});
              return [dim.field, sg];
            }).object().value()
  });

export const explorer = state => 
  Object.assign({}, state.explorer,
    ({
      filteredRecs: filteredRecs(state),
      dimVals: dimVals(state),
    }));
