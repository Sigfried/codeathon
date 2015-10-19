import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DimList from './DimList';
// no idea if these from starter will be useful
import { pushState } from 'redux-router';
import { resetErrorMessage } from '../actions';
import * as ExplorerActions from '../actions/explorer';
import { bindActionCreators } from 'redux';

export default class Explorer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchRecs(this.props.toFetch);
  }
  render() {
    const { explorer } = this.props;
    return (
      <div>
        <h1>Dims</h1>
        <DimList {...explorer} />
      </div>
    );
  }
}

Explorer.propTypes = {
  explorer: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    inputValue: state.router.location.pathname.substring(1),
    explorer: state.explorer,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ExplorerActions, dispatch);
}

export default connect(mapStateToProps, 
                    mapDispatchToProps
          //{ resetErrorMessage, pushState, }
                      )(Explorer);
