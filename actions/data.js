import {createAction} from 'redux-actions';
import fetch from 'isomorphic-fetch';

export const DATA_REQUESTED = 'DATA_REQUESTED';
export const DATA_RECEIVED = 'DATA_RECEIVED';
const requestData = createAction(DATA_REQUESTED);
const receiveData = createAction(DATA_RECEIVED);
export function fetchData(apiquery) {
  return dispatch => {
    dispatch(requestData(apiquery));
    return fetch('/data/' + apiquery)
      .then(response => response.json())
      .then(json => dispatch(receiveData(json)))
  }
}
export const SUPERGROUP_REQUESTED = 'SUPERGROUP_REQUESTED';
export const supergroupRequested = createAction(SUPERGROUP_REQUESTED);
export function supergroup(name, ...args) {
  args.name = name;
  return supergroupRequested(args);
}
