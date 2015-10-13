import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';

//import SparkBarsChart from '../components/SparkBars';
//import * as SparkBarsActions from '../actions/sparkbars';
import Explorer from '../components/Explorer';
import * as DataActions from '../actions/data';

function mapStateToProps(state) {
  return Object.assign({}, {toFetch: 'all'}, state);
}

function mapDispatchToProps(dispatch) {
  console.log(DataActions);
  console.log(bindActionCreators(DataActions, dispatch));
  return bindActionCreators(DataActions, dispatch);
  return bindActionCreators(
    Object.assign({}, /*SparkBarsActions,*/ DataActions), 
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
//export default connect(mapStateToProps, mapDispatchToProps)(Counter);
