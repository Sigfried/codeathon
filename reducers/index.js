import { combineReducers } from 'redux';
import counter from './counter';
import data from './data';

const reducer = combineReducers({
  counter, data
});

export default reducer;
