import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

const ANIMATION_DURATION = 400;

//import dimple from '../node_modules/dimple-js/dist/dimple.latest';
//import nvd3 from 'nvd3';

class LineChart extends Component {
    render() {
      const {val} = this.props;
      console.warn("don't do this");
      val.records.forEach((d,i)=>{
        d.value = Number(d.value);
      })
      return (<div ref="div" 
              style={{border:"1px solid blue", 
                      height:"200px", width:"700px"
                    }}>
              </div>);
     return <h2>hi</h2>;
    }
    componentDidMount() {
      const {val} = this.props;
      var sg = _.supergroup(_.sortBy(val.records,'issue_period'),
        ['result_name','patient_type']);
      var series = sg.leafNodes();
      this.lc = new d3LineChart();
      this.lc.setx(d=>d.issue_period)
      this.lc.sety(d=>d.value);
      //this.lc.create(this.refs.div, series.slice(0,1), 300, 100);
      this.lc.create(this.refs.div, series);
      //dimplelc(this.refs.svg, val);
      //nvdlc(d3.select(this.refs.svg).append('svg').node());
    }
}

// from http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// https://github.com/nicolashery/example-d3-react
class d3Chart {
  constructor() {
    this._margin = {top: 20, right: 20, bottom: 60, left: 50};
  }
  create(el, series, width, height) {
    this._setLayoutDims(el, width, height);
    var svg = d3.select(el).append('svg')
          .attr('class', 'd3')
          .attr('width', this._layout.width)
          .attr('height', this._layout.height);

    svg.append('g')
        .attr('class', 'd3chart');

    this.update(svg.node(), series);
  }
  update(el, series) {
    var colorScale = d3.scale.category10();
    // Re-compute the scales, and render the chart
    this._setLayoutDims(el);
    var scales = this._scales(el, _.flatten(series.map(d=>d.records)));
    //var prevScales = this._scales(el, state.prevDomain);
    //series.forEach((s,i) => this._drawChart(el, scales, s.records, colorScale(i)));
    series.forEach((s,i) => this._drawPoints(el, scales, s.records, colorScale(i)));
    //this._drawTooltips(el, scales, state.tooltips, prevScales);
  }
  _setLayoutDims(el, width, height) {
    this._layout = { width: width || el.offsetWidth, 
                     height: height || el.offsetHeight,
                   };
  }
}
class d3XYChart extends d3Chart {
  constructor() {
    super();
    this._getx = d=>d.x;
    this._gety = d=>this._gety(d);
  }
  setx(func) {
    if (typeof func === "undefined")
      return this._getx;
    return this._getx = func;
  }
  sety(func) {
    if (typeof func === "undefined")
      return this._gety;
    return this._gety = func;
  }
  _axes(scales) {
    var x = d3.svg.axis()
                  .scale(scales.x)
                  .orient("bottom");
    var y = d3.svg.axis()
                  .scale(scales.y)
                  .orient("left");
    return {x: x, y: y};
  };
  _scales(el, recs) {
    if (!recs) return null;

    var width = this._layout.width - this._margin.left - this._margin.right;
    var height = this._layout.height - this._margin.top - this._margin.bottom;

    // shouldn't always be ordinal!
    var x = d3.scale.ordinal()
      //.range([0, width])
      .rangePoints([this._margin.left, this._layout.width - this._margin.right])
      .domain(recs.map(this._getx).sort());

    var y = d3.scale.linear()
      //.range([height, 0])
      .range([this._layout.height - this._margin.bottom, this._margin.top])
      .domain(d3.extent(recs.map(this._gety)));

    return {x: x, y: y};
  };
  //_drawAxes(el, axes) { }
}
class d3LineChart extends d3XYChart {
  /*
   * expect getx, gety
   * make scales from points for now
   */

  _line(scales) {
    return d3.svg.line()
            .x(d => {let a=scales.x(this._getx(d));/*console.log(a);*/return a;})
            .y(d => {let a=scales.y(this._gety(d));/*console.log(a);*/return a;})
  }
  _drawChart(el, scales, data, color, prevScales, dispatcher) {
    var g = d3.select(el).selectAll('g.d3chart');

    var axes = this._axes(scales);
    //this._drawAxes(el, this._axes(scales));
    var xAxis = d3.select(el).append('g')
      .attr("class", "x axis")
                // FIX!!
      .attr("transform", "translate(0," + (this._layout.height - 40) + ")")
      .call(axes.x);
    // KLUDGE till i figure out how to handle css for d3 in react
    xAxis.selectAll('path,line')
      .style('fill','none')
      .style('stroke', '#000')
      .style('shape-rendering','crispEdges');
    xAxis.selectAll('.x').selectAll('path')
      .style('display','none')
    xAxis.selectAll('.line')
      .style('fill','none')
      .style('stroke', 'steelblue')
      .style('stroke-width', 1.5)

    //var line = g.selectAll('path.line') .datum(data, function(d) { return d.id; });
    g.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', this._line(scales))
        .style('fill','none')
        //.style('stroke','steelblue')
        .style('fill', color)
        .style('stroke-width',1.5)
      /*
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', function(d) { return scales.x(this._getx(d)); });

    point.attr('cy', function(d) { return scales.y(this._gety(d)); })
        .attr('r', function(d) { return scales.z(d.z); })
        .on('mouseover', function(d) {
          dispatcher.emit('point:mouseover', d);
        })
        .on('mouseout', function(d) {
          dispatcher.emit('point:mouseout', d);
        })
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', function(d) { return scales.x(this._getx(d)); });

    if (prevScales) {
      point.exit()
        .transition()
          .duration(ANIMATION_DURATION)
          .attr('cx', function(d) { return scales.x(this._getx(d)); })
          .remove();
    }
    else {
      point.exit()
          .remove();
    }
    */
  };
  _drawPoints(el, scales, data, color, prevScales, dispatcher) {
    var g = d3.select(el) //FIX   .selectAll('.d3-points');

    var point = g.selectAll('.d3-point')
      .data(data)//(, function(d) { return d.id; });

    //debugger;
    point.enter().append('circle')
        .attr('class', 'd3-point')
        .style('fill', color)
        .attr('cx', d => {
          if (prevScales) {
            return prevScales.x(this._getx(d));
          }
          return scales.x(this._getx(d));
        })
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', d => scales.x(this._getx(d)));

    point.attr('cy', d => scales.y(this._gety(d)) + (Math.random() - 0.5) * 5)
        .attr('r', 5)
        //.attr('r', d => { return scales.z(d.z); })
        .on('mouseover', d => {
          dispatcher.emit('point:mouseover', d);
        })
        .on('mouseout', d => {
          dispatcher.emit('point:mouseout', d);
        })
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', d => { return scales.x(this._getx(d)); });

    if (prevScales) {
      point.exit()
        .transition()
          .duration(ANIMATION_DURATION)
          .attr('cx', d => { return scales.x(this._getx(d)); })
          .remove();
    }
    else {
      point.exit()
          .remove();
    }
  };
}


function dimplelc(node, val) {
  var svg = d3.select(node);
  val.records.forEach((d,i)=>{
    d.value = Number(d.value);
    d.key = i;
  })
  var myChart = new dimple.chart(svg, val.records);
  myChart.setMargins("30px", "20px", "10px", "10px");
  var x = myChart.addCategoryAxis("x", "issue_period")
  x.addOrderRule("issue_period");
  x.addGroupOrderRule((...args)=>{
    console.log(args);
    return 1;
  });
  //x.title = '';
  x.hidden = true;
  var y = myChart.addMeasureAxis("y", "value");
  //y.ticks = 4;
  y.title = '';
  y.overrideMin = val.aggregate(d3.min, "value") * 1/1.2;
  y.overrideMax = val.aggregate(d3.max, "value") * 1.2;
  //console.log(y.overrideMin);
  //y.overrideMin = 10;
  //y.overrideMax = 100;
  var series = myChart.addSeries(["key","patient_type"], dimple.plot.line);
  //var series = myChart.addSeries("patient_type", dimple.plot.bubble);
  //series.x.addGroupOrderRule("issue_period");
  //series.y.addGroupOrderRule("issue_period");
  myChart.draw();
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
var lineStyle = {
  fill: 'steelblue',
  stroke: 'steelblue',
  strokeWidth: '1.5px',
};


LineChart.propTypes = {
  /*
  bars: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  */
};

export default LineChart;
