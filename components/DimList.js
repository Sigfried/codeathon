import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import LineChart from './LineChart';
var _ = require('supergroup');
import d3 from 'd3';

export default class DimList extends React.Component {
  constructor(props) {
    super(props);
    //this.state = props.dims;
  }
  shouldComponentUpdate(nextProps) {
    return this.props.dims != nextProps.dims ||
           this.props.recs != nextProps.recs
  }
  render() { 
    let { dims, recs, dispatch } = this.props;
    var dimComponents = _.map(dims, (dim,key) =>
      <Dim recs={recs} dim={dim} key={key} dispatch={dispatch} />
    );
    //return <LineChart/>;
    return <ul> {recs.length ? dimComponents : []} </ul>;
  }
}
DimList.propTypes = {
  dims: PropTypes.object.isRequired,
  recs: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};
function sparkWidth(vals) {
  var scale = d3.scale.log(10)
                .domain([1,100])
                .range([50, window.innerWidth]);
  return scale(vals.length);
}
class Dim extends React.Component {
  constructor(props) {
    super(props);
    //this.state = props.dim;
  }
  componentWillMount(nextProps, nextState) {
    const {dim, recs, dispatch} = this.props;
    dispatch(ExplorerActions.supergroup(dim, recs));
  }
  render() { 
    const {dim, dispatch} = this.props;
    let vals = [];
    let sparkbars = [];
    if (dim.vals) {
      vals = _.map(dim.vals, (val) => 
        <Val val={val} key={val.toString()} />);
      let barNums=_.map(dim.vals, val => val.records.length);
      sparkbars = <SparkBarsChart
                        valType={"supgergroup"}
                        vals={dim.vals}
                        barNums={barNums}
                        width={sparkWidth(vals)}
                        height={40} 
                        dispatch={dispatch}
                        />;
    }
    //console.log(bars);
    return <li>
            {sparkbars}
            <h3>{dim.name}</h3>
            <ul>
              {vals}
            </ul>
          </li>;
  }
}
Dim.propTypes = {
  dim: PropTypes.object.isRequired,
  recs: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  //key: PropTypes.number.isRequired,
};
class Val extends React.Component {
  render() { 
    var val = this.props.val;
    var missing = _.supergroup(val.records, 
                      d=>d.value.length ? 
                        'Has value' : 'Missing',
                        {dimName:'Missing'});
    var withValues = missing.lookup('Has value');
    var noValues = missing.lookup('Missing');
    var lcvals = withValues ? 
            <LineChart val={withValues} /> : '';

    return <li>
            <h4>{val.toString()} 
                &nbsp;
                ({val.records.length} records
                 {noValues ? ', ' + noValues.records.length + ' missing' : ''})
                </h4>
            {lcvals}
          </li>;
  }
}
/*
export default connect((state) => {
          return state; //.explorer.dims;
        })(DimList);
        */
