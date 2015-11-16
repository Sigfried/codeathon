
import React, { Component } from 'react';
import _ from 'supergroup';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';
import {D3Chart, D3XYChart} from './LineChart';

const isRealNode = (n, dimNames) => {
    return _.some(n.records, 
        rec=>_.isEqual(
            _(rec).pick(dimNames).values().compact().value(),
            n.pedigree().slice(1).map(String)));
};
function transform(d, ky) {
    return "translate(8," + d.dx * ky / 2 + ")";
}
function click(d, x, y, g) {
    if (!d.children) return;

    let kx = (d.y ? width - 40 : width) / (1 - d.y);
    let ky = height / d.dx;
    x.domain([d.y, 1]).range([d.y ? 40 : 0, width]);
    y.domain([d.x, d.x + d.dx]);

    var t = g.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

    t.select("rect")
        .attr("width", d.dy * kx)
        .attr("height", function(d) { return d.dx * ky; });

    t.select("text")
        .attr("transform", d=>transform(d,ky))
        .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

    d3.event.stopPropagation();
    return (kx, ky);
}
class D3IcicleHorizontal { // not a react component
    create(el, props) {
        const {width, height} = props;
        this.svg = d3.select(el).append('svg')
                .attr('class', 'd3')
                .attr('width', width)
                .attr('height', height)
        this.created = true;
    }
    draw(el, props, highlightFunc, drillFunc) {
        const { data, dataTitle, dimNames, valFunc, sortFunc, width, height, } = props;
        //console.log('draw with', valFunc);
        let x = this.x = d3.scale.linear().range([0, width]);
        let y = this.y = d3.scale.linear().range([0, height]);
        if (!data) debugger;
        this.root = _.supergroup(data, dimNames, {truncateBranchOnEmptyVal:true})
                    .asRootVal(dataTitle)
                    .addRecordsAsChildrenToLeafNodes();
        if (this.root.descendants().length > 500)
            debugger;

        this.partition = d3.layout.partition()
                        .value(valFunc)
                        .sort(sortFunc)

        if (!this.partition) debugger;
        let g = this.g = this.svg.selectAll("g")
                .data(this.partition.nodes(this.root), d=>d.namePath())
            .enter().append("svg:g")
                .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
                /*
                .on("click", d=>{
                    [kx, ky] = click(d, x, y, g);
                })
                */
                .on("click", drillFunc)
                .on("mouseover", highlightFunc)
                .style("cursor", "pointer")


        let kx = this.kx = width / this.root.dx,
            ky = this.ky = height / 1;

        g.append("svg:rect")
            .attr("width", this.root.dy * kx)
            .attr("height", function(d) { return d.dx * ky; })
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .style('stroke','white')
            .style('fill','steelblue')
            .style('opacity', d => isRealNode(d, dimNames) ? 1 : .4)
            .style("cursor", "pointer")

        g.append("svg:text")
            .attr("transform", transform)
            .attr("dy", ".35em")
            .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
            .text(function(d) { return d.toString(); })
            .style('opacity', d => isRealNode(d, dimNames) ? 1 : .4)
            .style("cursor", "pointer")

        this.drawn = true;
    }

    update(el, props, highlightFunc, drillFunc) {
        if (!this.drawn) {
            if (!this.created)
                this.create(el, props);
            this.draw(el, props, highlightFunc, drillFunc);
        }
        const { data, dataTitle, dimNames, valFunc, width, height, } = props;
        //console.log('update with', valFunc);
        let x = this.x,
            y = this.y,
            kx = this.kx,
            ky = this.ky;

        this.partition.value(valFunc);
        this.svg.selectAll("g")
            .data(this.partition.nodes(this.root), d=>d.namePath())

        this.svg.selectAll('g')
            .transition()
            .duration(1000)
            .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
        this.svg.selectAll('g')
            .select('rect')
            .transition()
            .duration(1000)
            .attr("width", this.root.dy * kx)
            .attr("height", function(d) { 
                return d.dx * ky; 
            })
        this.svg.selectAll('g')
            .select('text')
            .transition()
            .duration(1000)
            .attr("transform", d=>transform(d,ky))
            .attr("dy", ".35em")
            .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
            .text(function(d) { return d.toString(); })

            /*
        const isRealNode = n => {
          return _.some(n.records, 
              rec=>_.isEqual(
                    _(rec).pick(dimNames).values().compact().value(),
                    n.pedigree().slice(1).map(String)));
        };
        return (
          <Row>
            <Col md={8}>
              <svg width={width} height={height}>
              {thing.map((node, i) => {
                return (<IceCell  node={node} key={i} 
                    drillFunc={this.props.drillFunc}
                    highlight={this.nodeHighlight.bind(this)} 
                    isRealNode={isRealNode}
                    />);
              })}
              </svg>
            </Col>
            <Col md={4} >
              {valFunc.toString()}
              {highlightComp}
              {this.props.children}
            </Col>
          </Row>
        );
        */
    }
}
export default class Icicle extends Component {
    constructor() {
        super();
        this.state = { };
    }
    nodeHighlight(node) {
      this.setState({highlightedNode: node});
    }

    render() {
        const { data, width, height } = this.props;
        if (data.length < 1) {
            return (<h3>Loading .. </h3>);
        }

        let highlightComp = '';
        if (this.state.highlightedNode) {
            let node = this.state.highlightedNode;
            debugger;
            highlightComp = (
                <p>
                    {node.namePath({noRoot:true, delim:'\n'})}
                    <br/>
                    <br/>
                    {node.aggregate(list=>
                        _.sum(list.map(d=>parseInt(d))), 'cnt')} dimsets
                </p>);
            //console.log('highlight', node);
        }

        return (
            <Row>
                <Col md={6}>
                    <div ref="div" 
                        style={{//border:"1px solid blue", 
                                width, height,
                                fontSize: 10,
                            }}>
                        </div>
                </Col>
                <Col md={5} mdOffset={1}>
                    {highlightComp}
                    {this.props.children}
                </Col>
            </Row>
        );
    }
    componentDidMount() {
      this.lc = new D3IcicleHorizontal();
    }
    componentDidUpdate(prevProps, prevState) {
        if (!(
            this.props.valFunc !== prevProps.valFunc ||
            (this.props.data.length > 0 &&
            this.props.data !== prevProps.data)
        ))
            return;
        this.lc.update(this.refs.div, this.props,
            this.nodeHighlight.bind(this),
            this.drill.bind(this)
                      );
    }
    drill(node) { // specific to dimset stuff
        if (this.props.drillFunc)
        this.props.drillFunc(node);
    }
    highlight(node) {
        try {
            this.props.highlight(node);
        } catch(e) {
            debugger;
        }
    }
};
Icicle.propTypes = {
  data: React.PropTypes.array.isRequired, // array of objs
  dataTitle: React.PropTypes.string.isRequired, // name of the whole set
  dimNames: React.PropTypes.array.isRequired, // array of strings to group by
  valFunc: React.PropTypes.func.isRequired,
  sortFunc: React.PropTypes.func.isRequired,
};
Icicle.defaultProps = {
    width: window.innerWidth * 0.5, 
    height: window.innerHeight * 0.7, 
    valFunc: _.constant(1),
};

class IceCell extends Component {
  render() {
      let d = this.props.node;
      const real = this.props.isRealNode(d);

      // foreignobj from https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject
      return (
        <g>
          <rect x={x(d.y)} y={y(d.x)} 
                width={x(d.dy)} height={y(d.dx)} 
                style={{stroke: 'white', fill: real ? 'lightgrey' : 'darkgrey'}}
            onMouseOver={()=>this.highlight.bind(this)(d)}
            onClick={()=>this.drill.bind(this)(d)}
          />
              <foreignObject x={x(d.y)} y={y(d.x)}
                             width={x(d.dy)} height={y(d.dx)}
                            requiredExtensions="http://www.w3.org/1999/xhtml">
                <body xmlns="http://www.w3.org/1999/xhtml">
                  <p style={{
                              padding: 3,
                              wordWrap:'break-word',
                              overflow:'hidden', fontSize:'x-small',
                              pointerEvents: 'none',
                            }} 
                  >{d.toString()}</p>
                </body>
              </foreignObject>
        </g>
      );
  }
};

