
import { createSelector } from 'reselect'

export const explorer = state => state.explorer;
export const recs = state => state.explorer.recs;
export const dims = state => state.explorer.dims;
export const filterSettings = state.router.location.query.filters;

export const filteredRecs = createSelector(
  recs, filterSettings,
  (recs, filts) => {
  });


