import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import {DimList, Dim} from './DimList';
//import {ListContainer} from './ListContainer';
import {apicall} from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import LineChart from './LineChart';
import DataTable from './DataTable';
import { Grid, Row, Col, Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';
import * as Selector from '../selectors';
//var css = require('css!bootstrap/dist/css/bootstrap.css');
//require("!style!css!less!bootstrap/less/bootstrap.less");
require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");

export default class Dimsetsets extends Component {
  render() {
    const { datasets, schema, explorer /*, dispatch, router */ } = this.props;
    let apiparams = { schema,api:'dimsetsets',datasetLabel:'dimsetsets-summary' };
    let dimsetsets = explorer.datasets[Selector.apiId(apiparams)] || [];
    let dsss = _.map(dimsetsets,
        (dss) => {
          let apiparams = { schema,api:'dimsetset',
                  where: { dss: dss.dimsetset },
                  datasetLabel:'summary' };
          let info = explorer.datasets[Selector.apiId(apiparams)] &&
                    datasets[Selector.apiId(apiparams)][0] || {};
          return (
            <Row className="show-grid" key={dss.dimsetset}
              onClick={evt => this.dssClick.bind(this)(evt, dss)}
            >
              <Dimsetset dss={dss} apicall={apicall}
                  schema={schema}
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
  componentDidUpdate() {
    const {apicall, schema, datasets, explorer} = this.props;
    let apiparams = { schema,api:'dimsetsets',datasetLabel:'dimsetsets-summary' };
    let dimsetsets = explorer.datasets[Selector.apiId(apiparams)] || [];
    console.log(explorer.datasets);
    console.log(dimsetsets);
    dimsetsets.forEach(
      dss => apicall(Selector.apiId({ schema, api:'dimsetset', 
                where: { dss: dss.dimsetset },
                datasetLabel: 'summary'
            })));
  }
  dssClick(evt, dss) {
    debugger;
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
    this.getData();
  }
  getData() {
    const {dss, apicall, explorer, dispatch, schema, } = this.props;
    apicall(Selector.apiId({ schema, api:'denorm', 
                where: { dss: dss.dimsetset },
                datasetLabel:'data'
            }));
    console.log('asked for', dssId(dss, 'data', schema));
  }
  render() {
    const { dss, info } = this.props;
    const { records, records_with_values, measures,
            sets } = dss;
    const dims = dss.dimsetset.split(/,/);
    let gridWidth = Math.floor(10 / dims.length);
    let cols = _.map(dims,
        dim => {
          return (
            <Col style={styles.dimsetset} md={gridWidth} key={dim}>
              {dim} ({info[dim]}&nbsp;vals)
            </Col>);
        })

    return (<div>
              <Row>
                <strong>{dss.dimsetset}</strong><br/>
                <em>{records} recs, {measures} measures, {sets} sets</em>
              </Row>
              {cols}
            </div>);
  }
}
Dimsetset.propTypes = {
  dss: React.PropTypes.object.isRequired,
  info: React.PropTypes.object.isRequired,
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
            apicall,
          })(Dimsetsets);

