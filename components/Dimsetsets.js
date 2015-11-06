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
    const {apicall, explorer, dispatch, schema, dimsetset} = this.props;
    console.log(apicall);
    apicall(({ schema, api:'dimsetsets', dataset:'dimsetsets'}));
  }
  render() {
    const { dimsetsets /*, explorer, dispatch, router */ } = this.props;
    let dsss = _.map(dimsetsets,
        (dss) => {
          return (
            <Row className="show-grid" key={dss.dimsetset}>
              <Dimsetset dss={dss} 
              />
            </Row>);
        })
    return (
      <Grid>
        {dsss}
      </Grid>
    );
  }
  rowClick() {
    console.log(arguments);
  }
}
Dimsetsets.propTypes = {
  dimsetsets: React.PropTypes.array.isRequired,
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
  },
}
class Dimsetset extends Component {
  render() {
    const { dss } = this.props;
    const dims = dss.dimsetset.split(/,/);
    let gridWidth = Math.floor(12 / dims.length);
    let cols = _.map(dims,
        dim => {
          return (
            <Col style={styles.dimsetset} md={gridWidth} key={dim}>
              {dim}
            </Col>);
        })
    return <div>{cols}</div>;
  }
}
Dimsetset.propTypes = {
  dss: React.PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    explorer: Selector.explorer(state),
    router: state.router,
    dimsetsets: state.explorer.datasets.dimsetsets,
  };
}

export default connect(mapStateToProps, 
          { /*resetErrorMessage, */ 
            dispatch: dispatchWrappedFunc=>dispatchWrappedFunc, 
            apicall,
          })(Dimsetsets);

