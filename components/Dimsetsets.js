import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import {DimList, Dim} from './DimList';
//import {ListContainer} from './ListContainer';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import LineChart from './LineChart';
import DataTable from './DataTable';
import Icicle from './Icicle';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar, Input } from 'react-bootstrap';
import * as Selector from '../selectors';
//var css = require('css!bootstrap/dist/css/bootstrap.css');
//require("!style!css!less!bootstrap/less/bootstrap.less");
require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");

function valFuncs(pick) {
  const all = [
    { label: 'Dimsetset count',
      func:   d => 1,
    },
    { label: 'Result count',
      func:   d => d.aggregate(
                counts=>_.sum(counts.map(c=>parseInt(c))), 'cnt'),
    },
  ];
  if (pick)
    return _.find(all, {label: pick});
  return all;
}

export default class Dimsetsets extends Component {
  constructor() {
    super();
    this.state = {};
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
  render() {
    const { datasets, schema, explorer, apicall /*, dispatch, router */ } = this.props;
    let apiparams = { schema,api:'dimsetsets',datasetLabel:'dimsetsets-summary' };
    let dimsetsets = datasets[Selector.apiId(apiparams)] || [];
    /*
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

    const drillFunc = dim => {
      this.state.drillDims = dim.pedigree().map(String).slice(1);
      this.state.drillDss = this.state.drillDims.join(',');
      //console.log(this.context.queryChange);
      this.context.queryChange('dimsetset', this.state.drillDss);
      let apiparams = { schema, api:'dimsetset', 
                  where: { dss: this.state.drillDss},
                  datasetLabel:'summary' };
      this.state.drillApiString = Selector.apiId(apiparams);
      apicall(this.state.drillApiString);
      /*
      this.state.drillDims = dim.pedigree().map(String).slice(1);
      this.state.drillDss = this.state.drillDims.join(',');
      let apiparams = { schema, api:'denorm', 
                  where: { dss: this.state.drillDss },
                  datasetLabel:'data' };
      this.state.drillApiString = Selector.apiId(apiparams);
      apicall(this.state.drillApiString);
      /*
              <Icicle data={drillData}
                      dataTitle={this.state.drillDss||'Drill down waiting...'}
                      dimNames={this.state.drillDims || []}
                      valueFunction={d=> d.aggregate(
                        counts=>_.sum(counts.map(c=>parseInt(c))), 'cnt')}
              />
      */
    };
    let drillData = this.state.drillApiString && 
            datasets[this.state.drillApiString] || [];

    const buttons = valFuncs().map((f,i) =>
        <Input type="radio" name="valfunc" label={f.label} 
          defaultChecked={f.label === this.state.valFunc.label}
          value={f.func} key={f.label} onClick={()=>this.changeValFunc.bind(this)(f)}
        />
                                 );
    return (
      <Grid>
        <fieldset>
          {buttons}
        </fieldset>
        <Icicle data={icicleData}
                dataTitle={'Dim Set Sets'}
                dimNames={['dim_name_1','dim_name_2','dim_name_3',
                           'dim_name_4','dim_name_5','dim_name_6']}
                valueFunction={this.state.valFunc.func}
                drillFunc={drillFunc}
        >
          <div style={{border: '1px solid brown'}}>
              <h3>Icicle drilldown</h3>
              <pre>{JSON.stringify(drillData,null,2)}</pre>
          </div>
        </Icicle>
      </Grid>
    );
        //{dsss}
  }
  changeValFunc(valFunc) {
    this.setState({valFunc});
    console.log(valFunc);
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
