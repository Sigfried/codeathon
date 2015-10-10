import {createAction} from 'redux-actions';
import fetch from 'isomorphic-fetch';

export const NEW_DATA = 'NEW_DATA';

export const REQUEST_DATA = 'REQUEST_DATA';
export const requestData = createAction(REQUEST_DATA);

export const RECEIVE_DATA = 'RECEIVE_DATA';
export const receiveData = createAction(RECEIVE_DATA);

export const newData = createAction(NEW_DATA);

export const FILTER = 'FILTER';
export function filter() {
  return {
    type: FILTER,
    payload: (data) => data.filter((d) => d > 30),
  };
}

export function fetchData(delay=1000) {
  return dispatch => {
    dispatch(requestData());
    return fetch('/data')
      .then(response => response.json())
      .then(json => dispatch(receiveData(json)))
  }
}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
