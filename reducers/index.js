import { combineReducers } from 'redux';
import counter from './counter';
import data from './data';

const rootReducer = combineReducers({
  counter, data
});

export default rootReducer;
