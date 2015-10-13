import { REQUEST_DATA, RECEIVE_DATA, FILTER } from '../actions/data';
import { CLICK_CHART } from '../actions/sparkbars';
//var Immutable = require('immutable');  // too hard to use

const initialState = {
  recs: [],
};
export default function data(state, action) {
  console.log('DATA REDUCER', action);
  if (typeof state === 'undefined') {
    console.log('RETURNING', initialState);
    return initialState;
  }
  switch (action.type) {
  case CLICK_CHART:
    var newState = Object.assign({}, state);
    newState.bars = newState.bars.slice(1);
    return newState;
  case REQUEST_DATA:
    return state;
  case RECEIVE_DATA:
    return Object.assign({}, state,
                      {recs:action.payload});
  case FILTER:
    return action.payload(state);
  default:
    return state;
  }
}
