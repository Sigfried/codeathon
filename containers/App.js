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
  constructor(props) {
    super(props);
    //this.handleChange = this.handleChange.bind(this);
    this.handleDismissClick = this.handleDismissClick.bind(this);
  }

  handleDismissClick(e) {
    this.props.resetErrorMessage();
    e.preventDefault();
  }

  /* from starter
  handleChange(nextValue) {
    this.props.pushState(null, `/${nextValue}`);
  }
  */

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

  render() {
        //<PickData tableWidth={700} tableHeight={1000}/>
    const { children, explorer } = this.props;
    let schemaChoices = explorer.config.schemaChoices.map(
      sc => <MenuItem onSelect={this.schemaChoose.bind(this)} key={sc} eventKey={sc}>{sc}</MenuItem>);
    return (
      <div>
        <Navbar>
            <NavBrand><a href="/">Explorer</a></NavBrand>
            <Nav>
              <NavItem eventKey={1} href="/dqdata">DQ Data</NavItem>
              <NavItem eventKey={2} href="/seedims">See Dims</NavItem>
              <NavDropdown eventKey={3} title={explorer.schema} id="basic-nav-dropdown">
                {schemaChoices}
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
    location.reload();
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
