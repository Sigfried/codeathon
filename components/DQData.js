import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {DimList, Dim} from './DimList';
import * as ExplorerActions from '../actions/explorer';
//var Perf = require('react-addons-perf');

export default class Explorer extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const {dispatch, toFetch} = this.props;
    dispatch(ExplorerActions.fetchRecs(toFetch, dispatch,
      this.prepareDimsWhenRecsReady.bind(this)));
  }
  prepareDimsWhenRecsReady(recs) {
    const { dims, dispatch } = this.props;
    _.each(dims, dim => dispatch(ExplorerActions.supergroup(dim, recs)));
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
        <Message foo="bar" msg={explorer.msg} />
        <DimList dims={explorer.dims} {...explorer} dispatch={dispatch}>
          <Dim dim={{}} recs={[]} dispatch={()=>{}}>
          </Dim>
        </DimList>
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
  fontSize: '15px',
};
function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    inputValue: state.router.location.pathname.substring(1),
    explorer: state.explorer,
  };
}

export default connect(mapStateToProps//, 
                    //mapDispatchToProps
          //{ resetErrorMessage, pushState, }
                      )(Explorer);
