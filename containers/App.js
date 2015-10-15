import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';

//import SparkBarsChart from '../components/SparkBars';
//import * as SparkBarsActions from '../actions/sparkbars';
import Explorer from '../components/Explorer';
import * as DataActions from '../actions/data';

function mapStateToProps(state) {
  return Object.assign({}, 
        {
          toFetch: 'all',
          dims: [
            {field: 'data_element', name: 'Data Element' },
            {field: 'hospital_name', name: 'Hospital' },
            /*
            {field: 'issue_period', name: 'Period' },
            {field: 'measure_desc', name: 'Measure Description' },
            {field: 'measure_name', name: 'Measure Name' },
            {field: 'patient_type', name: 'Patient Type' },
            {field: 'result_name', name: 'Result Name' },
            //{field: 'result_unit', name: 'Unit' },
            //{field: 'value', name: 'Value' },
            {field: 'source_name', name: 'Source' },
            */
          ],
        }, state);
}

function mapDispatchToProps(dispatch) {
  //console.log(DataActions);
  //console.log(bindActionCreators(DataActions, dispatch));
  return bindActionCreators(DataActions, dispatch);
  //return bindActionCreators( Object.assign({}, /*SparkBarsActions,*/ DataActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
//export default connect(mapStateToProps, mapDispatchToProps)(Counter);
