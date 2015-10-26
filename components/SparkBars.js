import React, { Component, PropTypes } from 'react';
import d3 from 'd3';
import { connect } from 'react-redux';
import * as ExplorerActions from '../actions/explorer';
//var Perf = require('react-addons-perf');

class SparkBarsChart extends Component {
  //componentDidMount() { Perf.start(); }
  shouldComponentUpdate(nextProps) {
    return this.props.vals != nextProps.vals;
  }
  render() {
    const {dim, valType, vals, barNums, width, height } = this.props;
    //return <h4>debugging</h4>;
    var ext = d3.extent(barNums);
    var dumbExt = [0, ext[1]];
    var yscale = d3.scale.linear()
                    .domain(dumbExt)
                    .range([0, height]);
    var barWidth = width / vals.length;
    var bars = [];
    var self = this;
    vals.forEach(function(val, i) {
        bars.push(
            <SparkBarsBar 
                dim={dim}
                val={val}
                barNum={barNums[i]} x={barWidth*i}
                chartHeight={self.props.height}
                barWidth={barWidth} 
                yscale={yscale}
                key={i}
                />);
    });
    return (
      <div>
        <svg width={width} height={height}>
            <rect 
                style={{...chartStyle}}
                width={width} height={height}
                    onClick={e => this.clickChart(e)}
                    />
            {bars}
        </svg>
      </div>);
                
  }
  clickChart(e) {
    this.props.onChartClick('hello');
    this.props.fetchData();
  }
}
var barStyle = {
  fill: 'steelblue',
  opacity: 0.6,
  strokeWidth: 1,
  stroke: 'white',
};
var barBgStyle = {
  fill: 'steelblue',
  opacity: 0.1,
  strokeWidth: 1,
  stroke: 'white',
};
var chartStyle = {
  opacity: 0,
};

SparkBarsChart.propTypes = {
  vals: PropTypes.array.isRequired,
  barNums: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
SparkBarsChart.contextTypes =  {
  dispatch: PropTypes.func,
}
export default SparkBarsChart;

class SparkBarsBar extends Component {
    // val, x, chartHeight
    render() {
      const {val, barNum, yscale, chartHeight, 
        x, barWidth} = this.props;
      const height = yscale(barNum);
      const y = chartHeight - height;
      return (
        <g transform={"translate(" + x + ")"}>
          <rect
                  style={{...barBgStyle}}
                  width={barWidth}
                  height={chartHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={y} 
                  style={{...barStyle}}
                  width={barWidth}
                  height={height} 
                  onMouseOver={this.valHover.bind(this)}
          />
        </g>
      );
    }
    valHover() {
      const { dispatch } = this.context;
      const { val, dim } = this.props;
      //Perf.stop();
      //Perf.printExclusive(Perf.getLastMeasurements());
      //Perf.printWasted(Perf.getLastMeasurements());
      //Perf.start();
      //console.log(val.toString(), barNum, evt.target);
      //document.getElementById('msgp').innerHTML = 'dispatching ' + val.toString();
      dispatch(ExplorerActions.sgValMsg(val));
      //document.getElementById('msgp').innerHTML = val.toString();
    }
};
SparkBarsBar.contextTypes =  {
  explorer: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

/*
export default connect((state) => {
          return state; //.explorer.dims;
        })(SparkBarsChart);
        */
