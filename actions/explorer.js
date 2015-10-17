import {createAction} from 'redux-actions';
//import fetch from 'isomorphic-fetch';
var _ = require('supergroup');
require('isomorphic-fetch');

export const DATA_REQUESTED = 'DATA_REQUESTED';
export const DATA_RECEIVED = 'DATA_RECEIVED';
const requestData = createAction(DATA_REQUESTED);

const receiveData = 
  createAction(DATA_RECEIVED, (data,statekey)=>data,(data,statekey)=>{return {name:statekey}});

export function fetchRecs(apiquery) {
  return dispatch => {
    dispatch(requestData(apiquery));
    return fetch('/data/' + apiquery)
      .then(response => response.json())
      .then(json => {
        console.log(receiveData(json,'recs'));
        dispatch(receiveData(json, 'recs'))
      });
  }
}
