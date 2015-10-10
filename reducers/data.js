import { REQUEST_DATA, RECEIVE_DATA, FILTER } from '../actions/data';
import { CLICK_CHART } from '../actions/sparkbars';
//var Immutable = require('immutable');  // too hard to use

var fakedata = {
  bars: [83,54,23,45,56,33],
  odata: {},
};

export default function data(state = fakedata, action) {
  switch (action.type) {
  case CLICK_CHART:
    var newState = Object.assign({}, state);
    newState.bars = newState.bars.slice(1);
    return newState;
  case REQUEST_DATA:
    return state;
  case RECEIVE_DATA:
    var newState = Object.assign({}, state);
    newState.odata = Object.assign({}, state.odata, action.payload);
    return newState;
  case FILTER:
    return action.payload(state);
  default:
    return state;
  }
}
