import React, { Component, PropTypes } from 'react';
import d3 from 'd3';
import { connect } from 'react-redux';
import * as ExplorerActions from '../actions/explorer';
//var Perf = require('react-addons-perf');

class SparkBarsChart extends Component {
  //componentDidMount() { Perf.start(); }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.vals != nextProps.vals ||
           this.props.highlighted != nextProps.highlighted;
  }
  render() {
    const {dim, valType, vals, width, height, 
        isHighlighted, highlight, notmissing } = this.props;
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
            notmissing && (d.lookup('Not Missing') && 
                (d.lookup('Not Missing').records.length + ext[1]))
              ||d.records.length))
          ).forEach(function(val, i) {
        bars.push(
            notmissing &&
            <SparkBarsBarStack
                dim={dim}
                val={val}
                isHighlighted={isHighlighted}
                highlight={highlight}
                //barNum={barNums[i]} 
                x={barWidth*i}
                chartHeight={self.props.height}
                barWidth={barWidth} 
                yscale={yscale}
                key={i}
                />
                ||
            <SparkBarsBar
                dim={dim}
                val={val}
                //isHighlighted={isHighlighted}
                //highlight={highlight}
                x={barWidth*i}
                chartHeight={self.props.height}
                barWidth={barWidth} 
                yscale={yscale}
                key={i}
                />
        );
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
    render() {
      const {dim, val, yscale, chartHeight, 
        x, barWidth, isHighlighted} = this.props;
      const height = yscale(val.records.length);
      const y = chartHeight - height;
      //let highlighted = isHighlighted(dim,val)
      let highlighted = false;
      return (
        <g transform={"translate(" + x + ")"}>
          <rect
                  style={barStyles['background' + !!highlighted]}
                  width={barWidth}
                  height={chartHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={chartHeight - height} 
                  style={barStyles['normal' + !!highlighted]}
                  width={barWidth}
                  height={height} 
                  onMouseOver={this.valHover.bind(this)}
          />
        </g>
      );
    }
    valHover() {
      const { dispatch, router, explorer } = this.context;
      const { val, dim, highlight } = this.props;
      highlight(dim, val);
      //dispatch(ExplorerActions.sgValMsg(val, dim));
      //ExplorerActions.valHighlighted(dispatch, router, dim, val);
    }
};
class SparkBarsBarStack extends SparkBarsBar {
    // val, x, chartHeight
    render() {
      const {dim, val, yscale, chartHeight, 
        x, barWidth, isHighlighted} = this.props;
      const height = yscale(val.records.length);
      const y = chartHeight - height;
      let notMissing = val.lookup('Not Missing');
      let notMissingHeight = notMissing && yscale(notMissing.records.length) || 0;
      let highlighted = isHighlighted(dim,val)
      return (
        <g transform={"translate(" + x + ")"}>
          <rect
                  style={barStyles['background' + !!highlighted]}
                  width={barWidth}
                  height={chartHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={y} 
                  style={barStyles['missing' + !!highlighted]}
                  width={barWidth}
                  height={height} 
                  onMouseOver={this.valHover.bind(this)}
          />
          <rect y={chartHeight - notMissingHeight} 
                  style={barStyles['normal' + !!highlighted]}
                  width={barWidth}
                  height={notMissingHeight} 
                  onMouseOver={this.valHover.bind(this)}
          />
        </g>
      );
    }
};
function barStyle(type, highlighted) {
  let opacities = {
    background: .2,
    missing: .4,
    normal: 1,
  };
  let colors = {
    background: 'steelblue',
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
const barStyles = 
  _.chain([true,false]).map(highlighted =>
      _.map(['normal', 'missing', 'background'],
            type => [type + highlighted, barStyle(type, highlighted)])
                           ).flatten().object().value();

SparkBarsBar.contextTypes =  {
  explorer: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  router: React.PropTypes.object,
};

/*
export default connect((state) => {
          return state; //.explorer.dims;
        })(SparkBarsChart);
        */
