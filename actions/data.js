import {createAction} from 'redux-actions';
import fetch from 'isomorphic-fetch';
var _ = require('supergroup');

export const DATA_REQUESTED = 'DATA_REQUESTED';
export const DATA_RECEIVED = 'DATA_RECEIVED';
const requestData = createAction(DATA_REQUESTED);
//const receiveData = createAction(DATA_RECEIVED);
const receiveData = 
  createAction(DATA_RECEIVED, (data,statekey)=>data,(data,statekey)=>{return {name:statekey}});
export function fetchRecs(apiquery) {
  return dispatch => {
    debugger;
    dispatch(requestData(apiquery));
    return fetch('/data/' + apiquery)
      //.then(response => response.json())
      .then(response => dispatch(receiveData(response.json(), 'recs')))
  }
}
/*
export const SUPERGROUP_FULFILLED = 'SUPERGROUP_FULFILLED';
const supergroupFulfilled = 
  createAction(SUPERGROUP_FULFILLED, (sg,name)=>sg,(sg,name)=>{return {name:name}});
*/
export function supergroup(name, ...args) {
  console.log(arguments);
  var action = receiveData(Promise.resolve(_.supergroup(...args)), name);
  console.log('supergroup!!', name, action);
  return action;
  /*
  console.log('supergrouping ', name);
  var promise = new Promise((resolve, reject) => {
    console.log('in promise', name);
    resolve(_.supergroup(...args));
  });
  return {
    type: 'SUPERGROUP_FULFILLED',
    payload: promise,
    meta: {name: name},
  }
  */
}
//export const supergroupRequestedAction = createAction(SUPERGROUP_REQUESTED);
/*
export function supergroupReq() {
  return (dispatch, getState) => {
    var state = getState();
    console.log('supergroupReq state', state);
  };
}
export function supergroup(name, ...args) {
  return {
    types: [
      'SUPERGROUP_REQUESTED',
      'ACTION_FULFILLED',
      'ACTION_REJECTED'
    ],
    payload: {
      promise: new Promise(() => _.supergroup(...args)),
      data: args
    }
  };
}
export function XXsupergroup(name, ...args) {
  var promise = new Promise((resolve,reject) => {
    console.log('supergrouping ', name);
    setTimeout(() => resolve(_.supergroup(...args)));
  }, 0);
  args.name = name;
  //return supergroupRequested({name:name, sg:sg});
  return dispatch => {
    dispatch(requestData('supergrouping ' + name));
    return promise
      .then( (sg) => {
        console.log('PROMISE',arguments);
        dispatch(supergroupRequested({name:name, sg:sg}));
      })
  }
}
*/
