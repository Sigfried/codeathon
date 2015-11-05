import {createAction} from 'redux-actions';
import { pushState } from 'redux-router';
//import fetch from 'isomorphic-fetch';
import _ from 'supergroup';
import * as dimUtils from '../dimUtils';
require('isomorphic-fetch');

//export const CONFIG_CHANGED = 'CONFIG_CHANGED';
//export const configChange = createAction(CONFIG_CHANGED);
export const schemaChange = (dispatch, router, schema) => {
  let query = router.location.query;
  query.schema = schema;
  dispatch(pushState(query, router.location.pathname, query));
};

export const DATA_REQUESTED = 'DATA_REQUESTED';
export const DATA_RECEIVED = 'DATA_RECEIVED';
export const DIMLIST_SET = 'DIMLIST_SET';
const requestData = createAction(DATA_REQUESTED);

const receiveData = createAction(DATA_RECEIVED);

export function fetchRecs(schema, apiquery, dispatch, callbacks) {
  schema = schema || 'public';
  fetch('/data/' + schema + '/' + apiquery)
    .then(response => response.json())
    .then(json => {
      if (callbacks.recsFilter)
        json = json.filter(callbacks.recsFilter);
      if (callbacks.recsMap)
        json = json.map(callbacks.recsMap);
      dispatch(receiveData(json))
      return json;
    })
    .then(callbacks.postFetchAction || (d=>d))
  return requestData(apiquery);
}
export function fetchRecsAsync(apiquery) {
  return dispatch => {
    dispatch(requestData(apiquery));
    return fetch('/data/' + apiquery)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveData(json))
      });
  }
}

const dimsSet = createAction(DIMLIST_SET);
export function setDimsFromRecs(recs) {
  let dims = dimUtils.fromRecs(recs);
  return dimsSet(dims);
}
/*
export const SUPERGROUPED_DIM = 'SUPERGROUPED_DIM';
const supergrouped =  // puts dim into meta
  createAction(SUPERGROUPED_DIM, (data,dim)=>data, (data,dim)=>dim);
export function supergroup(dim, recs) {
  var sg = _.supergroup(recs, dim.func || dim.field);
  if (sg.length)
    sg = sg.sortBy(dim.sortBy || (a=>-a.records.length));
  //DEBUG
  //sg = sg.slice(0,3);
  var action = supergrouped(sg, dim);
  return action;
  //return dispatch(action);
}
*/
export function supergroupAsync(dim, recs) {
  return (dispatch, getState) => {
    var sg = _.supergroup(recs, dim.func || dim.field);
    if (sg.length)
      sg = sg.sortBy(a=>-a.records.length);
    //DEBUG
    //sg = sg.slice(0,3);
    var action = supergrouped(sg, dim);
    return dispatch(action);
  };
}
export const valHighlighted = (dispatch, router, dim, val) => {
  let query = router.location.query;
  if (dim && val)
    query.highlighted = [dim.field, val.toString()];
  else
    delete query.highlighted;
  dispatch(pushState(query, router.location.pathname, query));
};
export const filterOut = (dispatch, router, dim, val, which) => {
  //const { pushState, explorer, router, dispatch } = this.context;
  //const { dim, val } = this.props;
  let query = router.location.query;
  query.filters = query.filters || {};
  query.filters[dim.field] = query.filters[dim.field] || {};
  if (which === false)
    delete query.filters[dim.field][val];
  else
    query.filters[dim.field][val] = true;
  dispatch(pushState(query, router.location.pathname,query));
};

/*
export const MSG = 'MSG';
export const messageChanged = createAction(MSG);
export const sgValMsg = createAction(MSG,
  d=>d,
  (val,dim,ctr)=>{return {
    name:dim.field||'general', val:val, dim:dim,ctr:ctr}});
*/
