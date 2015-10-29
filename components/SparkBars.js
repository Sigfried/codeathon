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
    vals.sortBy(dim.sortBy ||
          (d=>-(
              (d.lookup('Not Missing') && 
                (d.lookup('Not Missing').records.length + ext[1]))
              ||d.records.length))
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
            {bars}
        </svg>
      </div>);
                
  }
}
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
    /*
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
    */
    valHover() {
      const { dispatch, router, explorer } = this.context;
      const { val, dim } = this.props;
      //dispatch(ExplorerActions.sgValMsg(val, dim));
      ExplorerActions.valHighlighted(dispatch, router, dim, val);
    }
    barStyle(type) {
      const { explorer } = this.context;
      const { val, dim } = this.props;
      let highlighted = explorer.isValHighlighted(dim,val);
      let opacities = {
        background: .2,
        missing: .4,
        normal: 1,
      };
      let colors = {
        background: 'white',
        missing: 'steelblue',
        normal: 'steelblue',
      };
      return {
        fill: colors[type],
        strokeWidth: 1,
        stroke: highlighted ? 'steelblue' : 'white',
        opacity: opacities[type] / (highlighted ? 1 : 2)
      };
    }
};
SparkBarsBar.contextTypes =  {
  explorer: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  router: React.PropTypes.object,
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
                  style={this.barStyle.bind(this)('background')}
                  width={barWidth}
                  height={chartHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={y} 
                  style={this.barStyle.bind(this)('missing')}
                  width={barWidth}
                  height={height} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={chartHeight - notMissingHeight} 
                  style={this.barStyle.bind(this)('normal')}
                  width={barWidth}
                  height={notMissingHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
        </g>
      );
    }
};

/*
export default connect((state) => {
          return state; //.explorer.dims;
        })(SparkBarsChart);
        */
