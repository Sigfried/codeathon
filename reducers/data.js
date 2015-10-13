import { SUPERGROUP_REQUESTED, DATA_REQUESTED, DATA_RECEIVED, 
        FILTER } 
        from '../actions/data';
import { CLICK_CHART } from '../actions/sparkbars';
var _ = require('supergroup');
//var Immutable = require('immutable');  // too hard to use

const initialState = {
  recs: [],
};
export default function data(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
  case CLICK_CHART:
    var newState = Object.assign({}, state);
    newState.bars = newState.bars.slice(1);
    return newState;
  case DATA_REQUESTED:
    return state;
  case DATA_RECEIVED:
    return Object.assign({}, state,
                      {recs:action.payload});
  case FILTER:
    return action.payload(state);
  case SUPERGROUP_REQUESTED:
    var o = {};
    o[action.payload.name] = _.supergroup(...action.payload);
    return Object.assign({}, state, o);
  default:
    return state;
  }
}
