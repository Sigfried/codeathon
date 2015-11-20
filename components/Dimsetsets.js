import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import {DimList, Dim} from './DimList';
//import {ListContainer} from './ListContainer';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import LineChart from './LineChart';
import DataTable from './DataTable';
import Icicle from './Icicle';
import ApiWrapper from './Wrapper';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar, Input } from 'react-bootstrap';
import * as Selector from '../selectors';
import _ from 'supergroup';
//var css = require('css!bootstrap/dist/css/bootstrap.css');
//require("!style!css!less!bootstrap/less/bootstrap.less");
require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");

const dimNames=['dim_name_1','dim_name_2','dim_name_3',
                'dim_name_4','dim_name_5','dim_name_6'];

function valFuncs(pick) {
  const all = [
    { label: 'Equal weighting',
      func:   d => {return 1},
    },
    { label: 'Size by observation count',
      func:   d => {
        let res = d.aggregate(
                counts=>_.sum(counts.map(c=>parseInt(c))), 'cnt');
        return res;
      }
    },
  ];
  if (pick)
    return _.find(all, {label: pick});
  return all;
}
const isRealNode = (n) => {
    return _.some(n.records, 
        rec=>_.isEqual(
            _(rec).pick(dimNames).values().compact().value(),
            n.pedigree().slice(1).map(String)));
};
function nodeGCb(node) {
  d3.select(this)
    .style('opacity', isRealNode(node) ? 1 : .4);
}
export default class Dimsetsets extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.highlightedDim = null;
    this.state.drillApiString;
    this.state.drillDss = '';
    this.state.drillDims = [];
    this.state.valFunc = valFuncs()[0];
  }
  componentWillMount() {
    const {apicall, schema, } = this.props;
    let apiparams = { schema,api:'icicle',datasetLabel:'icicle' };
    let apistring = Selector.apiId(apiparams);
    apicall(apistring);
  }
  
  hoverCb(dim, domNode, svg) {
    
    if (!isRealNode(dim))
      return;

    svg.selectAll('g').style('opacity', .4);
    d3.select(domNode).style('opacity', 1);

    const {schema} = this.props;
    let drillDims = dim.pedigree().map(String).slice(1);
    let drillDss = drillDims.join(',');
    if (!drillDss) return;
    const apiParams = { schema, api:'dimsetset', 
                  where: { dss: drillDss},
                  datasetLabel:'summary' };
    this.setState({highlightedDim: dim, hoverApiParams: apiParams});
    //console.log('hover set state', dim.namePath(), apiParams.where);
  }

  drillCb(dim, domNode, svg) {
    if (!isRealNode(dim))
      return;

    svg.selectAll('rect').style('stroke', 'white').style('stroke-width',1);
    d3.select(domNode).select('rect').style('stroke', 'brown').style('stroke-width',5);

    const {schema} = this.props;
    let drillDims = dim.pedigree().map(String).slice(1);
    let drillDss = drillDims.join(',');
    if (!drillDss) return;
    const apiParams = { schema, api:'denorm', 
                where: { dss: drillDss },
                datasetLabel:'data' };
    this.context.queryChange('dimsetset', drillDss);
    this.setState({drillDim: dim, drillApiParams: apiParams});
    /*
    let apiparams = { schema, api:'dimsetset', 
                where: { dss: this.state.drillDss},
                datasetLabel:'summary' };
    this.state.drillApiString = Selector.apiId(apiparams);
    apicall(this.state.drillApiString);
    */

  };
  
  render() {
    const { datasets, schema, explorer, apicall /*, dispatch, router */ } = this.props;

    /*
    let apiparams = { schema,api:'dimsetsets',datasetLabel:'dimsetsets-summary' };
    let dimsetsets = datasets[Selector.apiId(apiparams)] || [];
    let dsss = _.map(dimsetsets,
        (dss) => {
          return (
            <Row className="show-grid" key={dss.dimsetset}
              onClick={evt => this.dssClick.bind(this)(evt, dss)}
            >
              <Dimsetset dss={dss} apicall={apicall}
                  schema={schema} datasets={datasets}
              />
            </Row>);
        })
    */
    let icicleparams = { schema,api:'icicle',datasetLabel:'icicle' };
    let icicleData = datasets[Selector.apiId(icicleparams)] || [];

    const buttons = valFuncs().map((f,i) =>
        <Input type="radio" name="valfunc" label={f.label} 
          defaultChecked={f.label === this.state.valFunc.label}
          value={f.func} key={f.label} onClick={()=>this.changeValFunc.bind(this)(f)}
        />
                                 );
    let sortFunc = (a,b) =>
        valFuncs('Size by observation count').func(b) -
        valFuncs('Size by observation count').func(a);
    return (
      <Grid>
        <fieldset>
          {buttons}
        </fieldset>
        <Row>
            <Col md={6}>
              <Icicle data={icicleData}
                      dataTitle={'Dim Set Sets'}
                      dimNames={dimNames}
                      valFunc={this.state.valFunc.func}
                      sortFunc={sortFunc}
                      drillCb={this.drillCb.bind(this)}
                      hoverCb={this.hoverCb.bind(this)}
                      nodeGCb={nodeGCb}
                      zoomable={false}
              >
              </Icicle>
            </Col>
            <Col md={5} mdOffset={1}>
              <ApiWrapper 
                  passthrough={{
                    dim: this.state.highlightedDim,
                    apiParams: this.state.hoverApiParams,
                    icicleData,
                  }} 
                  apiParams={this.state.hoverApiParams}>
                <HighlightedDim />
              </ApiWrapper>
              <hr/>
              <ApiWrapper 
                  passthrough={{
                    dim: this.state.drillDim,
                    icicleData,
                  }} 
                  apiParams={this.state.drillApiParams}>
                <DrillDim />
              </ApiWrapper>
            </Col>
        </Row>
      </Grid>
    );
        //{dsss}
    /*
                {this.props.children}
    */
  }
  changeValFunc(valFunc) {
    this.setState({valFunc});
  }
  dssClick(evt, dss) {
    //debugger;
  }
}
Dimsetsets.contextTypes = {
  queryChange: React.PropTypes.func,
};

function dssId(dss, what, schema) {
  return `${schema}_dimsetset_${what}_${dss.dimsetset}`;
}
Dimsetsets.propTypes = {
  datasets: React.PropTypes.object.isRequired,
  /*
  explorer: PropTypes.object.isRequired,
  dispatch: React.PropTypes.func,
  router: React.PropTypes.object,
  schema: React.PropTypes.string.isRequired,
  recs: React.PropTypes.array.isRequired,
  */
};
const styles = {
  dimsetset: {
    border: '1px solid gray',
    margin: 3,
  },
}
function nestPath(list, i, n, counts) {
  // SAVE THIS -- WAY TO MAKE NESTED LIST FROM SG.VAL.PEDIGREE
  let valCount = '';
  if (counts && list[i].toString() in counts) {
      valCount = ', ' + counts[list[i].toString()] + ' values'
  } else {
    console.log('expected ', list[i]+'', 'in', counts);
    debugger;
  }
  if (i < n) {
    return <ul>
            <li>
              <strong>{list[i].toString()}</strong>
              {valCount}
              <br/>
              {nestPath(list, i + 1, n, counts)}
            </li>
           </ul>;
  } else {
    return <ul>
            <li>
              <strong>{list[i].toString()}</strong>
              {valCount}
              <br/>
              {details(list[i])}
            </li>
           </ul>;
  }
  function details(n) {
    return (<div>
              (
                {agg(list[i],'cnt')} groups, {}
                {agg(list[i],'measures')} measures, {}
                <pre>
                {JSON.stringify(list[i].records,null,2)},
                </pre>
              )
           </div>);
  }
}
export class DrillDim extends Component {
  /*
  componentWillReceiveProps(newprops, otherarg) {
    if (newprops.passthrough.dim === this.props.passthrough.dim)
      return;
    this.setState({highlightedVal: null});
  }
  */
  render() {
    const {dataReady, data, passthrough, apiString} = this.props;
    const {dim} = passthrough;
    if (!dim)
      return <p></p>;
    if (!dataReady)
      return (
          <h5>Loading details for {dim.namePath({delim: ' / ', noRoot:true})}...</h5>
      );
    if (dataReady && !data.length)
      debugger;

    let nodes = dim.pedigree({noRoot:true}).map(
                  nodeDim => (
                    <DrillDimNode
                      dim={nodeDim} data={data}
                      key={nodeDim.toString()}
                    />
                  ));
    return (
        <div>
            <h4>Details for {dim.namePath({delim: ' / ', noRoot:true})}</h4>
            {nodes}
        </div>
    );
  }
}
export class DrillDimNode extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const {dim, data} = this.props;
    const hval = this.state.highlightedVal;
    let sg = _.supergroup(data, dim.toString());
    let sparkbars = sg.length && <SparkBarsChart
                        valType={"supgergroup"}
                        //vals={dimVals}
                        vals={sg}
                        dim={dim}
                        //barNums={barNums}
                        width={200}
                        height={40} 
                        highlight={this.highlight.bind(this)}
                        isHighlighted={this.isHighlighted.bind(this)}
                        />
                || '';
    return (
        <div>
            <h5>{dim.toString()}</h5>
            {sparkbars}
            {hval && hval.valueOf()}
            <pre>
              {hval && JSON.stringify(hval.records, null, 2)}
            </pre>
        </div>
    );
  }
  highlight(dim,val) {
    this.setState({highlightedVal: val});
  }
  isHighlighted(dim,val) {
    return dim === this.props.dim && 
           _.isEqual(val, this.state.highlightedVal);
  }
}
export class HighlightedDim extends Component {
  render() {
    const {dataReady, data, passthrough, apiString} = this.props;
    const {dim} = passthrough;

    if (!dim)
      return <p></p>;

    if (dataReady && data.length !== 1)
      debugger;

    //const list = dim.pedigree();
    //const indented = nestPath(list, 1, list.length -1, data[0]);

    const info = dimInfo(dim, dataReady && data[0]);
    return (
            <div>
                {info}
            </div>);
  }
}
function dimInfo(dim, counts = {}) {
  const list = dim.pedigree();

  let lis = list.slice(1).map((item,i) => {
    let valCount = ', ' + (counts[item.toString()]||'[fetching...]') + 
                   ' distinct values'
    return <li key={i}>
            <strong>{item.toString()}</strong>
            {valCount}
            <br/>
          </li>
  });
  let actRec = actualDimRec(dim);
  return (
          <div>
            <h5>{list.length - 1} dimensions:</h5>
            <ul>{lis}</ul>
            {counts.sets||'[fetching...]'} dimension combinations (dimsets)
            <br/>
            {counts.measures||'[fetching...]'} measures
            <br/>
            {counts.agg_methods||'[fetching...]'} aggregation methods
            <br/>
            {actRec.cnt} observations
          </div>
         );
         /*
            <pre>
            actRec
            {JSON.stringify(actRec,null,2)},
            counts
            {JSON.stringify(counts,null,2)},
            </pre>
            */
}
function actualDimRec(dim) {
  return _.find(dim.records,
    rec => {
      let dimsInRec = _.chain(dimNames)
              .reduce((memo, dimName) =>
                      memo + ((rec[dimName]) ? 1 : 0), 0)
              .value()
      return dimsInRec === dim.depth;
    });
}
function agg(node, field) {
  return node.aggregate(list=>
            _.sum(list.map(d=>parseInt(d))), field)
}


class Dimsetset extends Component {
  componentWillMount() {
    //this.getData();
  }
  getData() {
    const {dss, apicall, explorer, dispatch, schema, } = this.props;
    let apiparams = { schema, api:'denorm', 
                where: { dss: dss.dimsetset },
                datasetLabel:'data' };
    let apistring = Selector.apiId(apiparams);
    apicall(apistring);
    //console.log('asked for', apistring);
  }
  render() {
    const { dss, schema, datasets,  } = this.props;
    const { records, records_with_values, measures,
            sets } = dss;

    let apiparams = { schema, api:'denorm', 
                where: { dss: dss.dimsetset },
                datasetLabel:'data' };
    let data = datasets[Selector.apiId(apiparams)];
    //data && console.log('GOT SOMETHING', data);

    const dims = dss.dimsetset.split(/,/);
    let gridWidth = Math.floor(10 / dims.length);
    let dimComps = _.map(dims,
        dim => <Dim data={data || []} dss={dss} dim={dim} 
                  key={dim} gridWidth={gridWidth}/>
    );

    return (<div>
              <Row onClick={this.getData.bind(this)}>
                <strong>{dss.dimsetset}</strong><br/>
                <em>{records} recs, {measures} measures</em>
              </Row>
              {dimComps}
            </div>);
  }
}
Dimsetset.propTypes = {
  dss: React.PropTypes.object.isRequired,
};
export class Dim extends Component {
  render() {
    const { data, dim, gridWidth} = this.props;
    // dim is string here
    if (!data.length)
      return <div/>;

    let sg = _.supergroup(data, dim);
    //if (data.length) debugger;
    let sparkbars = sg.length && <SparkBarsChart
                        valType={"supgergroup"}
                        //vals={dimVals}
                        vals={sg}
                        dim={dim}
                        //barNums={barNums}
                        width={200}
                        height={40} 
                        />
                || '';
                        /*
                        isHighlighted={explorer.isValHighlighted}
                        highlight={(dim,val)=>
                          ExplorerActions.valHighlighted(dispatch,router,dim,val)}
                        highlighted={explorer.highlighted}
                        */
    return (
      <Col style={styles.dimsetset} md={gridWidth} key={dim}>
        {dim}
        {sparkbars}
      </Col>);
  }
}
Dim.propTypes = {
  data: React.PropTypes.array.isRequired,
  dim: React.PropTypes.string.isRequired,
  gridWidth: React.PropTypes.number.isRequired,
};
function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    explorer: Selector.explorer(state),
    router: state.router,
    datasets: state.explorer.datasets,
    schema: state.router.location.query.schema,
  };
}

export default connect(mapStateToProps,
          { /*resetErrorMessage, */ 
            dispatch: dispatchWrappedFunc=>dispatchWrappedFunc,
            apicall: ExplorerActions.apicall,
          })(Dimsetsets);
