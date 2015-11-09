
import React, { Component } from 'react';
import _ from 'supergroup';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';

let width = 600, height = 700,
    x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([0,  height]),
    root = _.supergroup([]).asRootVal('root');

class IciclePart extends Component {
  render() {
      let d = this.props.node;

      return (
        <rect x={x(d.y)} y={y(d.x)} 
              width={x(d.dy)} height={y(d.dx)} 
              style={{stroke: 'white', fill: 'lightgrey'}}
          onMouseOver={()=>this.highlight.bind(this)(d)}
        />
      );
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
        let valFunc = this.props.valueFunction || 
                      _.constant(1); // default to record count
        root = _.supergroup(data, dimNames,
                  {truncateBranchOnEmptyVal:true})
                .asRootVal(dataTitle)
                .addRecordsAsChildrenToLeafNodes();

        let partition = d3.layout.partition()
                          .value(valFunc)

        let thing = partition(root)
            width = 600, height = 700,
            x = d3.scale.linear().range([0, width]),
            y = d3.scale.linear().range([0,  height])

        let highlightComp = '';
        if (this.state.highlightedNode) {
          highlightComp = this.state.highlightedNode.namePath();
        }
        return (
          <Row>
            <Col md={8}>
              <svg width={width} height={height}>
              {thing.map((node, i) => {
                return (<IciclePart  node={node} key={i} 
                    highlight={this.nodeHighlight.bind(this)} />);
              })}
              </svg>
            </Col>
            <Col md={4} >
              {highlightComp}
            </Col>
          </Row>
        );
    }
};
Icicle.propTypes = {
  data: React.PropTypes.array.isRequired, // array of objs
  dataTitle: React.PropTypes.string.isRequired, // name of the whole set
  dimNames: React.PropTypes.array.isRequired, // array of strings to group by
};
