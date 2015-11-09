
import React, { Component } from 'react';
import _ from 'supergroup';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';
import {Dim} from './DimSetsets';

let width = 600, height = 700,
    x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([0,  height]),
    root = _.supergroup([]).asRootVal('root');

let dimsShown = [];
class IciclePart extends Component {
  render() {
      let d = this.props.dim;

      return (
        <rect x={x(d.y)} y={y(d.x)} 
              width={x(d.dy)} height={y(d.dx)} 
              style={{stroke: 'white', fill: 'lightgrey'}}
          onMouseOver={()=>this.showDims.bind(this)(d)}
        />
      );
  }
  showDims(dim) {
    try {
      this.props.onDims(dim);
    } catch(e) {
      debugger;
    }
    /*
        dim => <Dim data={data || []} dss={dss} dim={dim} key={dim} gridWidth={gridWidth}/>
                  */

  }
};

export default class Icicle extends Component {

    constructor() {
      super();
      this.state = {dims: []};
    }

    showDim(dim) {
      
    }
    buildTree(data, depth=1) {
        console.log("depth", depth);
        let groups = _.groupBy(data, d => d[`dim_name_${depth}`]);

        _.keys(groups).forEach(key => {
            if (_.any(groups[key].map(d => !!d[`dim_name_${depth+1}`]))) {
                groups[key] = this.buildTree(groups[key], depth+1);
            }else{
                groups[key] = groups[key].reduce(
                    (mem, d) => mem+Number(d.cnt),
                    0);
            }
        });

        return groups;
    }

    addDims(dims) {
      this.setState({dims: dims});
    }

    render() {
        if (this.props.data.length < 1) {
            return (<h3>Loading .. </h3>);
        }
        root = _.supergroup(this.props.data,
          ['dim_name_1','dim_name_2','dim_name_3','dim_name_4','dim_name_5','dim_name_6']
            , {truncateBranchOnEmptyVal:true}).asRootVal('dimsetsets');
        root.addRecordsAsChildrenToLeafNodes(); // fix supergroup to return root

        let partition = d3.layout.partition()
                          .value(()=>1)
                          //.children(d => isNaN(d.value) ? d3.entries(d.value) : null)
                          //.value(d => d.records.length);

        //console.log(tree);

        let thing = partition(root)
            width = 600, height = 700,
            x = d3.scale.linear().range([0, width]),
            y = d3.scale.linear().range([0,  height])

        console.log(this.state.dims);
        let data = this.state.dims.records || [];
        let dim = this.state.dims.toString() || 'blah';
        return (
          <Row>
            <Col md={8}>
              <svg width={width} height={height}>
              {thing.map((d, i) => {
                return (<IciclePart  dim={d} key={i} onDims={this.addDims.bind(this)} />);
              })}
              </svg>
            </Col>
            <Col md={4} ref='dims'>
              <Dim data={data || []} dim={dim} 
                      key={dim} gridWidth={4} />
            </Col>
          </Row>
        );
    }
};
