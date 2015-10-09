import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';

import SparkBarsChart from '../components/SparkBars';

function mapStateToProps(state) {
  var data=[23,34,54];
  return {
    bars: state.data,
    width: 150,
    height: 50,

    //counter: state.counter,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SparkBarsChart);
//export default connect(mapStateToProps, mapDispatchToProps)(Counter);
