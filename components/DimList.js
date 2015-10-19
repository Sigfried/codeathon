import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
var _ = require('lodash');

export default class DimList extends React.Component {
  constructor(props) {
    super(props);
    //this.state = props.dims;
  }
  render() { 
    // Injected by react-redux: (in connect below)
    let { dims, recs, dispatch } = this.props;
    //let boundActionCreators = bindActionCreators(ExplorerActions, this.props.dispatch);
    var dimComponents = _.map(dims, (dim,key) => 
      <Dim recs={recs} dim={dim} key={key} 
          dispatch={dispatch}
          //{...boundActionCreators}
      />);
    return <ul> {recs.length ? dimComponents : []} </ul>;
  }
  componentWillUpdate(nextProps, nextState) {
}
DimList.propTypes = {
  dims: PropTypes.object.isRequired,
  recs: PropTypes.array.isRequired,
};
class Dim extends React.Component {
  constructor(props) {
    super(props);
    //this.state = props.dim;
  }
  componentWillMount(nextProps, nextState) {
    var dim = this.props.dim;
    this.props.dispatch(ExplorerActions.supergroup(
      dim, this.props.recs));
  }
  render() { 
    var dim = this.props.dim;
    let vals = [];
    if (dim.vals) {
      vals = _.map(dim.vals, (val) => 
        <Val val={val} key={val.toString()} />);
    }
    let bars=_.map(dim.vals, val => val.records.length);
    var sparkbars = <SparkBarsChart
                      bars={bars}
                      width={150}
                      height={75} 
                      />;
    console.log(bars);
    return <li>{dim.name}
            {sparkbars}
            <ul>
              {vals}
            </ul>
          </li>;
  }
}
class Val extends React.Component {
  render() { 
    var val = this.props.val;
    return <li>
            {val.toString()} ({val.records.length})
          </li>;
  }
}
export default connect((state) => {
          return state; //.explorer.dims;
        })(DimList);
