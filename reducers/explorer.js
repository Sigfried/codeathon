import { combineReducers } from 'redux';
import conf from '../explorer.conf';
import {DATA_RECEIVED, SUPERGROUPED_DIM, DIMLIST_SET,
        DATA_CACHED,
        //CONFIG_CHANGED,
        //MSG, 
       } from '../actions/explorer';
import _ from 'lodash';
var settings = conf();

function dataCache(state = {}, action) {
  switch (action.type) {
    case DATA_CACHED:
      const s = Object.assign({}, state, 
        { [action.payload.url]: action.payload.data });
      return s;
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
function datasets(state = {dimsetsets:[]}, action) {
  switch (action.type) {
    case DATA_RECEIVED:
      if (!Array.isArray(action.payload))
        return Object.assign({}, state, action.payload);
    case DATA_CACHED:
      const s = Object.assign({}, state, 
        { [action.payload.dataset]: action.payload.data });
      return s;
    default:
      return state;
  }
}
function config(state = settings.config, action) {
  switch (action.type) {
    /*
    case CONFIG_CHANGED:
      return Object.assign({}, settings.config, action.payload);
    */
    default:
      return state;
  }
}
/*
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
*/
function dims(state = settings.dims, action) {
  switch (action.type) {
  default:
    return state;
  }
}
function dimList(state = [], action) {
  switch (action.type) {
  case DIMLIST_SET:
    return action.payload;
  default:
    return state;
  }
}
/*
function filter(state = {default:'nothin'}, action) {
  switch (action.type) {
  case FILTER_CHANGED:
    let {dim, val, setting} = action.payload;
    let dimSetting = Object.assign(
      {}, state[dim.field] || {}, 
      {[val.toString()]: setting});
    return Object.assign({}, state, { [dim.field]: dimSetting });
  default:
    return state;
  }
}
*/
function hash(state='', action) {
};
const explorerReducers = combineReducers({
  recs, dims, config, dimList, datasets, dataCache,
});
export default explorerReducers;
