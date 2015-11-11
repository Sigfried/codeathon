
import React, { Component } from 'react';
import _ from 'supergroup';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';

let width = 600, height = 700,
    x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([0,  height]),
    root = _.supergroup([]).asRootVal('root');

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

export default class Icicle extends Component {

    constructor() {
      super();
      this.state = {};
    }

    nodeHighlight(node) {
      this.setState({highlightedNode: node});
    }

    render() {
        const { data, dataTitle, dimNames } = this.props;
        if (data.length < 1) {
            return (<h3>Loading .. </h3>);
        }

        let valFunc = this.props.valueFunction;
        console.log(valFunc);
        root = _.supergroup(data, dimNames,
                  {truncateBranchOnEmptyVal:true})
                .asRootVal(dataTitle)
                .addRecordsAsChildrenToLeafNodes();
        //console.log(root+'', root.descendants().length)
        if (root.descendants().length > 500)
          debugger;

        let partition = d3.layout.partition()
                          .value(valFunc)

        let thing = partition(root)
            width = 600, height = 700,
            x = d3.scale.linear().range([0, width]),
            y = d3.scale.linear().range([0,  height])

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
    }
};
Icicle.propTypes = {
  data: React.PropTypes.array.isRequired, // array of objs
  dataTitle: React.PropTypes.string.isRequired, // name of the whole set
  dimNames: React.PropTypes.array.isRequired, // array of strings to group by
  valueFunction: React.PropTypes.func.isRequired,
};
