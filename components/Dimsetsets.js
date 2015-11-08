import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import {DimList, Dim} from './DimList';
//import {ListContainer} from './ListContainer';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import LineChart from './LineChart';
import DataTable from './DataTable';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';
import * as Selector from '../selectors';
import _ from 'supergroup';
//var css = require('css!bootstrap/dist/css/bootstrap.css');
//require("!style!css!less!bootstrap/less/bootstrap.less");
require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");

export default class Dimsetsets extends Component {
  render() {
    const { datasets, schema, explorer, apicall /*, dispatch, router */ } = this.props;
    let apiparams = { schema,api:'dimsetsets',datasetLabel:'dimsetsets-summary' };
    let dimsetsets = datasets[Selector.apiId(apiparams)] || [];
    let dsss = _.map(dimsetsets,
        (dss) => {
          let apiparams = { schema,api:'dimsetset',
                  where: { dss: dss.dimsetset },
                  datasetLabel:'summary' };
          let info = datasets[Selector.apiId(apiparams)] &&
                    datasets[Selector.apiId(apiparams)][0] || {};
          return (
            <Row className="show-grid" key={dss.dimsetset}
              onClick={evt => this.dssClick.bind(this)(evt, dss)}
            >
              <Dimsetset dss={dss} apicall={apicall}
                  schema={schema} datasets={datasets}
                  info={info}
              />
            </Row>);
        })
    return (
      <Grid>
        {dsss}
      </Grid>
    );
  }
  dssClick(evt, dss) {
    //debugger;
  }
}
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
    console.log('asked for', apistring);
  }
  render() {
    const { dss, info, schema, datasets,  } = this.props;
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
  info: React.PropTypes.object.isRequired,
};
class Dim extends Component {
  render() {
    const { dss, data, dim, gridWidth} = this.props;
    const { records, records_with_values, measures,
            sets } = dss;

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
  dss: React.PropTypes.object.isRequired,
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
