import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import { pushState } from 'redux-router';
//import Explore from '../components/Explore'; // from real-world redux starter
//import Explorer from '../components/Explorer'; // my thing
import DQData from '../components/DQData';
import PickData from '../components/PickData';
import { resetErrorMessage } from '../actions';
import * as Selector from '../selectors';

import * as ExplorerActions from '../actions/explorer';
import { Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");

class App extends Component {
  componentWillMount() {
    const {explorer, dispatch} = this.props;
    dispatch(ExplorerActions.fetchRecs(explorer.schema, 
        'dimsetsets', {}, dispatch, 
        { sortBy: d => -d.records, }, 'dimsetsets'));
  }
  render() {
        //<PickData tableWidth={700} tableHeight={1000}/>
    const { explorer } = this.props;

    let schemaChoices = explorer.config.schemaChoices.map(
      sc => <MenuItem onSelect={this.schemaChoose.bind(this)} key={'sc'+sc} eventKey={sc}>{sc}</MenuItem>);

    let dimsetsetChoices = explorer.datasets.dimsetsets ?
      explorer.datasets.dimsetsets.map(
        dc => <MenuItem onSelect={this.dssChoose.bind(this)} key={'dss'+dc.dimsetset} eventKey={dc.dimsetset}>{dc.dimsetset} ({dc.records})</MenuItem>)
      : '';

    let children = React.Children.map(this.props.children, function(child, i) {
        return React.cloneElement(child, {
          schema: explorer.schema,
          dimsetset: explorer.dimsetset,
          recs: explorer.recs,
        });
    }, this);
    return (
      <div>
        <Navbar>
            <NavBrand><a href="/">Explorer</a></NavBrand>
            <Nav>
              <NavItem eventKey={1} href="/dqdata">DQ Data</NavItem>
              <NavItem eventKey={2} href="/seedims">See Dims</NavItem>
              <NavItem eventKey={3} href="/dimsetsets">Dimsetset Browser</NavItem>
              <NavDropdown eventKey={4} title={explorer.schema} id="basic-nav-dropdown">
                {schemaChoices}
              </NavDropdown>
              <NavDropdown eventKey={5} title={explorer.dimsetset} id="basic-nav-dropdown">
                {dimsetsetChoices}
              </NavDropdown>
            </Nav>
          </Navbar>
        {this.renderErrorMessage()}
        {children}
      </div>
    );
  }
  schemaChoose(evt, schema) {
    console.log(evt, schema);
    ExplorerActions.schemaChange(
      this.props.dispatch,
      this.props.router,
      schema);
    //location.reload();
  }
  dssChoose(evt, dss) {
    ExplorerActions.queryChange(
      this.props.dispatch,
      this.props.router,
      'dimsetset', dss);
    //location.reload();
  }
  renderErrorMessage() {
    const { errorMessage } = this.props;
    if (!errorMessage) {
      return null;
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    );
  }
}
        /*
        <hr />
        <Explore value={inputValue}
                 onChange={this.handleChange} />
        */
        // not sure what this stuff from example does, may be useful later

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  //pushState: PropTypes.func.isRequired,
  //inputValue: PropTypes.string.isRequired,
  //explorer: PropTypes.object.isRequired,
  // Injected by React Router
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    explorer: Selector.explorer(state),
    router: state.router,
    //inputValue: state.router.location.pathname.substring(1),
    //explorer: state.explorer,
    //explorer: state.explorer.explorerReducer,
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  dispatch: d => d,
  //pushState,
})(App);
