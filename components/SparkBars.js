import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

/*
 * things => array of things to be represented by bars (individual rectangles)
 * valFunc => func(thing, i) returning a number that gives relative height of bar
 *
 * optional functions to call if a bar is hovered over:
 *    highlight, endHighlight => func(thing,passthrough,i,mouseEvent)
 * optional function to determine if a bar should be highlighted:
 *    isHighlighted => func(thing,passthrough,i)
 * 
 * sortBy => func(thing) should return value to determine bar order
 *           defaults to bar value
 *          
 */
class SparkBarsChart extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.things != nextProps.things ||
           this.props.highlighted != nextProps.highlighted;
  }
  render() {
    const {passthrough, width, height, 
        isHighlighted, highlight, endHighlight} = this.props;
    const valFunc = this.props.valFunc || (d=>d);
    const things = _.sortBy(this.props.things, this.props.sortBy||(d=>d));
    var ext = d3.extent(things.map((thing,i)=>valFunc(thing,i)));
    var dumbExt = [0, ext[1]];
    var yscale = d3.scale.linear()
                    .domain(dumbExt)
                    .range([0, height]);
    var barWidth = width / things.length;
    var bars = [];
    var self = this;
    things
        .forEach(function(thing, i) {
          bars.push(
            <SparkBarsBar
                passthrough={passthrough}
                thing={thing}
                valFunc={valFunc}
                isHighlighted={isHighlighted}
                highlight={highlight}
                endHighlight={endHighlight}
                x={barWidth*i}
                chartHeight={self.props.height}
                barWidth={barWidth} 
                yscale={yscale}
                i={i}
                key={i}
                />);
        });
    return (<div>
              <svg width={width} height={height}>
                {bars}
              </svg>
            </div>);
  }
}
SparkBarsChart.propTypes = {
  things: PropTypes.array.isRequired, 
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
export default SparkBarsChart;

class SparkBarsBar extends Component {
    render() {
      let {passthrough, thing, valFunc, i, yscale, chartHeight, 
        x, barWidth, highlight, isHighlighted, endHighlight} = this.props;
      const height = yscale(valFunc(thing, i));
      const y = chartHeight - height;
      highlight = highlight || _.noop;
      isHighlighted = isHighlighted || _.noop;
      endHighlight = endHighlight || _.noop;
      let highlighted = isHighlighted(thing,passthrough,i)
      return (
        <g transform={"translate(" + x + ")"}>
          <rect
                  style={barStyles['background' + !!highlighted]}
                  width={barWidth}
                  height={chartHeight} 
                  onMouseOver={evt=>highlight(thing,passthrough,i, evt)}
                  onMouseOut={evt=>endHighlight(thing,passthrough,i, evt)}
          />
          <rect y={chartHeight - height} 
                  style={barStyles['normal' + !!highlighted]}
                  width={barWidth}
                  height={height} 
                  onMouseOver={evt=>highlight(thing,passthrough,i, evt)}
                  onMouseOut={evt=>endHighlight(thing,passthrough,i, evt)}
          />
        </g>
      );
    }
};
function barStyle(type, highlighted) {
  let opacities = {
    background: .2,
    normal: 1,
  };
  let colors = {
    background: 'steelblue',
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
  _.chain([true,false])
   .map( highlighted => 
          _.map( ['normal', 'background'], type => 
                [type + highlighted, barStyle(type, highlighted)]
               )
       )
   .flatten().object().value();
