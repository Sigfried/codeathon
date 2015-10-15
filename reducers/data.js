import { SUPERGROUP_REQUESTED, SUPERGROUP_FULFILLED, SUPERGROUP_REJECTED,
          DATA_REQUESTED, DATA_RECEIVED, 
          FILTER } 
        from '../actions/data';
import { CLICK_CHART } from '../actions/sparkbars';
//var Immutable = require('immutable');  // too hard to use

const initialState = {
  recs: [],
};
export default function data(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
  case DATA_REQUESTED:
    return state;
  /*
  case DATA_RECEIVED:
    return Object.assign({}, state,
                      {recs:action.payload});
  */
  case FILTER:
    return action.payload(state);
  case DATA_RECEIVED:
    console.log('DATA_RECEIVED', action, 'old state', state);
    var newState = Object.assign({},state);
    newState[action.meta.name] = action.payload;
    debugger;
    return newState;
    /*
    return Object.assign({}, state, {action.meta.name: action.paylod});
    newState[action.meta.name] = jj
      Object.assign({}, state[action.meta.name], {sg: action.payload});
    debugger;
    return newState;
    */
  default:
    return state;
  }
}
