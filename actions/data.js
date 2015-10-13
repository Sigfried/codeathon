import {createAction} from 'redux-actions';
import fetch from 'isomorphic-fetch';

export const NEW_DATA = 'NEW_DATA';

export const REQUEST_DATA = 'REQUEST_DATA';
export const requestData = createAction(REQUEST_DATA);

export const RECEIVE_DATA = 'RECEIVE_DATA';
export const receiveData = createAction(RECEIVE_DATA);

export const newData = createAction(NEW_DATA);

export const initAction = createAction('uncaught action');

export const FILTER = 'FILTER';
export function filter() {
  return {
    type: FILTER,
    payload: (data) => data.filter((d) => d > 30),
  };
}
export function test(x) {
  return initAction(x);
}

export function fetchData(apiquery) {
  console.log(arguments);
  console.log(receiveData({recs:['sync fetchData test']}));
  /*
  return {
    type: 'RECEIVE_DATA',
    payload: ['sync fetchData test']
  };
  */
  //return receiveData({recs:['sync fetchData test']});
  return dispatch => {
    console.log(dispatch);
    dispatch(requestData(apiquery));
    return fetch('/data/' + apiquery)
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
