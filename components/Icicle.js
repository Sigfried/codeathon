
import React, { Component } from 'react';
import _ from 'supergroup';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';
import {D3Chart, D3XYChart} from './LineChart';

function transform(d, ky) {
    return "translate(8," + d.dx * ky / 2 + ")";
}
function click(d, x, y, g, width, height) {
    if (!d.children) 
        return [kx, ky];

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
    return [kx, ky];
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
    draw(el, props) {
        const { data, dataTitle, dimNames, valFunc, sortFunc, width, height, 
                drillCb, hoverCb, nodeGCb, zoomable
        } = props;
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
        let svg = this.svg;
        let g = this.g = svg.selectAll("g")
                .data(this.partition.nodes(this.root), d=>d.namePath())
            .enter().append("svg:g")
                .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
                .on("click.zoom", d=>{
                    if (zoomable)
                        [kx, ky] = click(d, x, y, g, width, height);
                })
                .on("mouseover.cb", function(d) { hoverCb(d, this, svg); } || _.noop)
                .on("click.cb", function(d) { drillCb(d, this, svg); } || _.noop)
                .style("cursor", "pointer")
                .each(nodeGCb || _.noop)
                .on("mouseout", () => nodeGCb && svg.selectAll("g").each(nodeGCb))


        let kx = this.kx = width / this.root.dx,
            ky = this.ky = height / 1;

        g.append("svg:rect")
            .attr("width", this.root.dy * kx)
            .attr("height", function(d) { return d.dx * ky; })
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .style('stroke','white')
            .style('fill','steelblue')
            .style("cursor", "pointer")

        g.append("svg:text")
            .attr("transform", transform)
            .attr("dy", ".35em")
            .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
            .text(function(d) { return d.toString(); })
            .style("cursor", "pointer")

        this.drawn = true;
    }

    update(el, props) {
        if (!this.drawn) {
            if (!this.created)
                this.create(el, props);
            this.draw(el, props);
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
    }
}
export default class Icicle extends Component {
    constructor() {
        super();
        this.state = { };
    }
    render() {
        const { data, width, height } = this.props;
        if (data.length < 1) {
            return (<h3>Loading .. </h3>);
        }
        return (
            <div ref="div" 
                style={{//border:"1px solid blue", 
                        width, height,
                        fontSize: 10,
                    }}>
                </div>
        );
    }
    componentDidMount() {
      this.lc = new D3IcicleHorizontal();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.valFunc !== prevProps.valFunc ||
            (this.props.data.length > 0 &&
            this.props.data !== prevProps.data)
        ) {
            this.lc.update(this.refs.div, this.props);
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
