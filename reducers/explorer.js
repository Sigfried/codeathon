import conf from '../explorer.conf';
import {DATA_RECEIVED } from '../actions/explorer';

export default function explorerReducer(state = conf(), action) {
  switch (action.type) {
  case DATA_RECEIVED:
    var newState = Object.assign({},state);
    newState[action.meta.name] = action.payload;
    return newState;
  default:
    return state;
  }
}
