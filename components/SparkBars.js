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
    const {dim, valType, vals, width, height } = this.props;
    //return <h4>debugging</h4>;
    var ext = d3.extent(vals.map(v=>v.records.length));
    var dumbExt = [0, ext[1]];
    var yscale = d3.scale.linear()
                    .domain(dumbExt)
                    .range([0, height]);
    var barWidth = width / vals.length;
    var bars = [];
    var self = this;
    vals.sortBy(
          d=>-(
              (d.lookup('Not Missing') && 
                (d.lookup('Not Missing').records.length + ext[1]))
              ||d.records.length)
               ).forEach(function(val, i) {
        bars.push(
            <SparkBarsBarStack
                dim={dim}
                val={val}
                //barNum={barNums[i]} 
                x={barWidth*i}
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
var barMissingStyle = {
  fill: 'steelblue',
  opacity: 0.3,
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
  //barNums: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
SparkBarsChart.contextTypes =  {
  dispatch: PropTypes.func,
}
export default SparkBarsChart;

class SparkBarsBar extends Component {
    // val, x, chartHeight
    renderNotUsing() {
      const {val, barNum, yscale, chartHeight, 
        x, barWidth} = this.props;
      const height = yscale(barNum);
      const y = chartHeight - height;
      return (
        <g transform={"translate(" + x + ")"}>
          <rect
                  style={barBgStyle}
                  width={barWidth}
                  height={chartHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={y} 
                  style={barStyle}
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
      //console.log(' ', ++vdctr, 'hover', dim.field, val+'');
      dispatch(ExplorerActions.sgValMsg(val, dim, vdctr));
      //document.getElementById('msgp').innerHTML = val.toString();
    }
};
class SparkBarsBarStack extends SparkBarsBar {
    // val, x, chartHeight
    render() {
      const {val, yscale, chartHeight, 
        x, barWidth} = this.props;
      const height = yscale(val.records.length);
      const y = chartHeight - height;
      let notMissing = val.lookup('Not Missing');
      let notMissingHeight = notMissing && yscale(notMissing.records.length) || 0;
      return (
        <g transform={"translate(" + x + ")"}>
          <rect
                  style={barBgStyle}
                  width={barWidth}
                  height={chartHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={y} 
                  style={barMissingStyle}
                  width={barWidth}
                  height={height} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={chartHeight - notMissingHeight} 
                  style={barStyle}
                  width={barWidth}
                  height={notMissingHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
        </g>
      );
    }
};
var vdctr = 0;
SparkBarsBar.contextTypes =  {
  explorer: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

/*
export default connect((state) => {
          return state; //.explorer.dims;
        })(SparkBarsChart);
        */
