import React, { Component, PropTypes } from 'react';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import SGVal from './SupergroupVal';
var _ = require('supergroup');
import d3 from 'd3';

export class DimList extends React.Component {
  constructor(props) {
    super(props);
    //this.state = props.dims;
  }
  shouldComponentUpdate(nextProps) {
    return this.props.dims != nextProps.dims ||
           this.props.recs != nextProps.recs
  }
  renderDims(dimComponent) {
    // make sure recs has items
    return _.map(this.props.dims, dim => {
      var c = React.cloneElement(dimComponent, {
        recs: this.props.recs,
        dispatch: this.props.dispatch,
        dim: dim
      })
      console.log(c);
      return c;
    });
  }
  render() { 
    const {recs, children} = this.props;
    if (!recs.length) return <div/>;
    var childrenToRender = React.Children.map(
        this.props.children, child => {
          //debugger;
          return child.type === Dim ?
            this.renderDims(child) : child
    });
    console.log(childrenToRender);
    return <div>{childrenToRender}</div>;
    /*
    console.log(React.Children.only());
    debugger;
    var children = React.Children.map(
                    this.props.children,
                    function(child) {
                      return <li>{child}</li>;
                    });
    return <ul>{children}</ul>;
    */
    /*

    let { dims, recs, dispatch } = this.props;
    var dimComponents = _.map(dims, (dim,key) =>
      <Dim recs={recs} dim={dim} key={key} dispatch={dispatch} />
    );
    //return <LineChart/>;
    return <ul> {recs.length ? dimComponents : []} </ul>;
    */
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
export class Dim extends React.Component {
  constructor(props) {
    super(props);
    //this.state = props.dim;
  }
  render() { 
    const {dim, dispatch} = this.props;
    let vals = [];
    let sparkbars = [];
    if (dim.vals) {
      vals = _.map(dim.vals, (val) => 
        <SGVal val={val} key={val.toString()} />);
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
/*
export default connect((state) => {
          return state; //.explorer.dims;
        })(DimList);
        */
