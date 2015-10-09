import { FETCH_ALL, FILTER } from '../actions/data';

var fakedata = [83,54,23,45,56,33];

export default function data(state = fakedata, action) {
  switch (action.type) {
  case FETCH_ALL:
    return state;
  case FILTER:
    return action.payload(state);
  default:
    return state;
  }
}
