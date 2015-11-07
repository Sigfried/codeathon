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
  componentWillMount() {
    this.getData();
  }
  getData() {
    const {apicall, explorer, dispatch, schema, } = this.props;
    apicall(({ schema, api:'dimsetsets', dataset:'dimsetsets'}));
  }
  render() {
    const { datasets /*, explorer, dispatch, router */ } = this.props;
    let dsss = _.map(datasets.dimsetsets,
        (dss) => {
          let info = datasets[dssId(dss)] &&
                    datasets[dssId(dss)][0] || {};
          return (
            <Row className="show-grid" key={dss.dimsetset}
              onClick={evt => this.dssClick.bind(this)(evt, dss)}
            >
              <Dimsetset dss={dss} 
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
    const {apicall, schema, datasets} = this.props;
    datasets.dimsetsets.forEach(
      dss => apicall(({ schema, api:'dimsetset', 
                where: { dss: dss.dimsetset },
                dataset:dssId(dss)
            })));
  }
  dssClick(evt, dss) {
    debugger;
  }
}
function dssId(dss) {
  return `dimsetset-data-${dss.dimsetset}`;
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
  render() {
    const { dss, info } = this.props;
    const { records, records_with_values, measures,
            sets } = dss;
    const dims = dss.dimsetset.split(/,/);
    let gridWidth = Math.floor(10 / (dims.length + 1));
    let cols = _.map(dims,
        dim => {
          return (
            <Col style={styles.dimsetset} md={gridWidth} key={dim}>
              {dim}
            </Col>);
        })
    cols.unshift(
      <Col style={styles.dimsetset} md={gridWidth} 
          key="info">
        {records} recs, {measures} measures,
        {sets} sets
      </Col>);

    console.log(dss,info);
    return <div>{cols}</div>;
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
  };
}

export default connect(mapStateToProps, 
          { /*resetErrorMessage, */ 
            dispatch: dispatchWrappedFunc=>dispatchWrappedFunc, 
            apicall,
          })(Dimsetsets);

