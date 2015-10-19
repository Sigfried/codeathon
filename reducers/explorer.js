import { combineReducers } from 'redux';
import conf from '../explorer.conf';
import {DATA_RECEIVED, SUPERGROUPED_DIM } from '../actions/explorer';
var _ = require('lodash');

function explorerReducer(state = conf(), action) {
  switch (action.type) {
  case DATA_RECEIVED:
    var newState = Object.assign({},state);
    newState[action.meta.name] = action.payload;
    return newState;
  default:
    return state;
  }
}
function recs(state = [], action) {
  switch (action.type) {
  case DATA_RECEIVED:
    if (Array.isArray(action.payload))
      return action.payload;
  default:
    return state;
  }
}
function toFetch(state = conf().toFetch, action) {
  return state;
}
function dims(state = conf().dims, action) {
  switch (action.type) {
  case SUPERGROUPED_DIM:
    var dim = Object.assign({}, action.meta,
                            { vals: action.payload });
    return Object.assign({}, state, { [dim.field]: dim });
  default:
    return state;
  }
}
const explorerReducers = combineReducers({
  recs, toFetch, dims
  //explorerReducer
  //rawData, dims
});
export default explorerReducers;
/*
function dims(recs = [], action) {
  switch (action.type) {
  case DATA_RECEIVED:
    if (Array.isArray(action.payload))
      return action.payload;
  default:
    return recs;
  }
}



*/


