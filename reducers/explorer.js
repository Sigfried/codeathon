import { combineReducers } from 'redux';
import conf from '../explorer.conf';
import {DATA_RECEIVED, SUPERGROUPED_DIM, MSG } from '../actions/explorer';
var _ = require('lodash');
var settings = conf();

function explorerReducer(state = settings, action) {
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
function toFetch(state = settings.toFetch, action) {
  return state;
}
function msg(state = {general:settings.msg}, action) {
  let name = action.meta && action.meta.name || 'general';
  switch (action.type) {
  case MSG:
    //console.log('     ', action.meta.ctr, 'action', action.meta.name, action.payload+'');
    return Object.assign(state, {[name]:action.payload});
  default:
    return state;
  }
}
function dims(state = settings.dims, action) {
  switch (action.type) {
  case SUPERGROUPED_DIM:
    //console.log(action.meta.name, state, action);
    var dim = Object.assign({}, action.meta,
                            { vals: action.payload }
                            //{ vals: action.payload.slice(0,1) }   // DEBUG!!!!!
                           );
    return Object.assign({}, state, { [dim.field]: dim });
  default:
    return state;
  }
}
const explorerReducers = combineReducers({
  recs, toFetch, dims, msg
});
export default explorerReducers;
