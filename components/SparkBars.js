import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

class SparkBarsChart extends Component {
  render() {
    //const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
    // bars just an array of nums
    var ext = d3.extent(this.props.bars);
    var dumbExt = [0, ext[1]];
    var yscale = d3.scale.linear()
                    .domain(dumbExt)
                    .range([0, this.props.height]);
    var barWidth = this.props.width / this.props.bars.length;
    var bars = [];
    var self = this;
    this.props.bars.forEach(function(bar, i) {
        bars.push(
            <SparkBarsBar 
                val={bar} x={barWidth*i}
                chartHeight={self.props.height}
                barWidth={barWidth} 
                yscale={yscale}
                key={i}
                />);
    });
    return (
      <div>
        <h1>hi</h1>
        <svg width={this.props.width} height={this.props.height}>
            <rect width={this.props.width} height={this.props.height}
                    fill="yellow"/>
            {bars}
        </svg>
      </div>);
                
  }
}

SparkBarsChart.propTypes = {
  bars: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default SparkBarsChart;
/*
 * container
 *  chart
 *    [bar, bar]
 *
 */
var SparkBarsBar = React.createClass({
    // val, x, chartHeight
    render: function() {
        var height = this.props.yscale(this.props.val);
        var y = this.props.chartHeight - height;
        return (<rect x={this.props.x} y={y} 
                    width={this.props.barWidth}
                    height={height} />);
    }
});

