import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import { pushState } from 'redux-router';
//import Explore from '../components/Explore'; // from real-world redux starter
//import Explorer from '../components/Explorer'; // my thing
import DQData from '../components/DQData'; // my thing
import { resetErrorMessage } from '../actions';

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
    const { children } = this.props;
    return (
      <div>
        <div>
          <h1>DQ Data Explorer</h1>
          <DQData />
          <br/>
        </div>
        <hr />
        {this.renderErrorMessage()}
        {children}
      </div>
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
    //inputValue: state.router.location.pathname.substring(1),
    //explorer: state.explorer,
    //explorer: state.explorer.explorerReducer,
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  //pushState,
})(App);
