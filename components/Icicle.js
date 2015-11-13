
import React, { Component } from 'react';
import _ from 'supergroup';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';
import {D3Chart, D3XYChart} from './LineChart';

let width = 600, height = 700,
    x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([0,  height]),
    root = _.supergroup([]).asRootVal('root');

class D3IcicleHorizontal { // not a react component
    create(el, state) {
        const {width, height} = state;
        this.svg = d3.select(el).append('svg')
                .attr('class', 'd3')
                .attr('width', width)
                .attr('height', height)
        this.created = true;
    }

    update(el, state) {
        if (!this.created)
            this.create(el, state);
        const { data, dataTitle, dimNames, valFunc, x, y, 
                width, height,
                    } = state;
        console.log(data);
        if (!data) debugger;
        let root = _.supergroup(data, dimNames, {truncateBranchOnEmptyVal:true})
                    .asRootVal(dataTitle)
                    .addRecordsAsChildrenToLeafNodes();
        if (root.descendants().length > 500)
          debugger;

        let partition = d3.layout.partition()
                          .value(valFunc)

        let g = this.svg.selectAll("g")
                .data(partition.nodes(root))
            .enter().append("svg:g")
                .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
                //.on("click", click);

        let kx = width / root.dx,
            ky = height / 1;

        g.append("svg:rect")
            .attr("width", root.dy * kx)
            .attr("height", function(d) { return d.dx * ky; })
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .style('stroke','white')
            .style('fill','lightgray')

        g.append("svg:text")
            .attr("transform", transform)
            .attr("dy", ".35em")
            .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
            .text(function(d) { return d.toString(); })

        function transform(d) {
            return "translate(8," + d.dx * ky / 2 + ")";
        }
            /*
        let highlightComp = '';
        if (this.state.highlightedNode) {
          let node = this.state.highlightedNode;
          highlightComp = (
            <p>
              {node.namePath()}<br/>
              {node.aggregate(list=>
                    _.sum(list.map(d=>parseInt(d))), 'cnt')} dimsets
            </p>);
        }
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
    constructor(props) {
        super();
        this.state = {
            width: props.width || 600,
            height: props.height || 600,
            root: _.supergroup([]).asRootVal('root'),
            valFunc: props.valFunc || _.constant(1),
        };
        this.state.x = d3.scale.linear().range([0, this.state.width]);
        this.state.y = d3.scale.linear().range([0, this.state.height]);
    }
    nodeHighlight(node) {
      this.setState({highlightedNode: node});
    }

    render() {
        const { data, dataTitle, dimNames } = this.props;
        const { width, height } = this.state;
        if (data.length < 1) {
            return (<h3>Loading .. </h3>);
        }
        return (<div ref="div" 
                style={{border:"1px solid blue", 
                        width, height,
                        fontSize: 10,
                      }}>
                </div>);
    }
    componentDidMount() {
      this.lc = new D3IcicleHorizontal();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.data.length < 1 || this.props.data === prevProps.data)
            return;
        console.log(this.props.data);
        this.setState({
            data: this.props.data,
            dimNames: this.props.dimNames,
            dataTitle: this.props.dataTitle,
        }, 
        ()=>this.lc.update(this.refs.div, this.state));
    }
};
Icicle.propTypes = {
  data: React.PropTypes.array.isRequired, // array of objs
  dataTitle: React.PropTypes.string.isRequired, // name of the whole set
  dimNames: React.PropTypes.array.isRequired, // array of strings to group by
  valueFunction: React.PropTypes.func.isRequired,
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

