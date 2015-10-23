import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DimList from './DimList';
// no idea if these from starter will be useful
import { pushState } from 'redux-router';
import { resetErrorMessage } from '../actions';
import * as ExplorerActions from '../actions/explorer';
import { bindActionCreators } from 'redux';
//var Perf = require('react-addons-perf');

export default class Explorer extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch(ExplorerActions.fetchRecs(this.props.toFetch, this.props.dispatch));
  }
  componentDidMount() {
    //Perf.stop();
    //Perf.printWasted();
    //Perf.start();
  }
  render() {
    const { explorer, dispatch } = this.props;
    return (
      <div>
        <p id="msgp" />
        <Message foo="bar" msg={explorer.msg} />
        <DimList {...explorer} dispatch={dispatch}/>
      </div>
    );
  }
}

Explorer.propTypes = {
  explorer: PropTypes.object.isRequired,
};
class Message extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    //Perf.stop();
    //Perf.printInclusive(Perf.getLastMeasurements());
  }
  render() {
    const { msg } = this.props;
    return (
      <p style={{...msgStyle}}>
        {msg}
      </p>
    );
  }
}
var msgStyle = {
  color: 'green',
  fontFamily: 'arial',
  fontSize: '25px',
};
function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    inputValue: state.router.location.pathname.substring(1),
    explorer: state.explorer,
  };
}
function mapDispatchToProps(dispatch) {
  ExplorerActions.dispatch = dispatch; // probably not supposed to do this
  return bindActionCreators(ExplorerActions, dispatch);
}

export default connect(mapStateToProps//, 
                    //mapDispatchToProps
          //{ resetErrorMessage, pushState, }
                      )(Explorer);
