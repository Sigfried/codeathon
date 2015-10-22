import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

class SparkBarsChart extends Component {
    render() {
      return <h4>debugging</h4>;
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
      console.log(barStyle);
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
          <svg width={this.props.width} height={this.props.height}>
              <rect 
                  {...chartStyle}
                  width={this.props.width} height={this.props.height}
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
class SparkBarsBar extends Component {
    // val, x, chartHeight
    render() {
        const {val, yscale, chartHeight, x, barWidth} = this.props;
        const height = yscale(val);
        const y = chartHeight - height;
        return (
          <g transform={"translate(" + x + ")"}>
            <rect
                    {...barBgStyle}
                    width={barWidth}
                    height={chartHeight} 
                    onMouseOver={valHover}
            />
            <rect y={y} 
                    {...barStyle}
                    width={barWidth}
                    height={height} 
            />
          </g>
        );
    }
};

function valHover(evt) {
  console.log(evt.target);
}

