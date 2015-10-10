import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';

import SparkBarsChart from '../components/SparkBars';
import * as SparkBarsActions from '../actions/sparkbars';
import * as DataActions from '../actions/data';

function mapStateToProps(state) {
  var data=[23,34,54];
  return {
    bars: state.data.bars,
    //onChartClick: (x) => console.log('hey', x),
    width: 150,
    height: 50,

    //counter: state.counter,
  };
}

function mapDispatchToProps(dispatch) {
  //return bindActionCreators(CounterActions, dispatch);
  return bindActionCreators(
    Object.assign({}, SparkBarsActions, DataActions), 
    dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SparkBarsChart);
//export default connect(mapStateToProps, mapDispatchToProps)(Counter);
