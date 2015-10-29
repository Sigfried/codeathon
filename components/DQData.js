import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
//import {DimList, Dim} from './DimList';
import {ListContainer} from './ListContainer';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import LineChart from './LineChart';
import { Glyphicon, Button, Panel } from 'react-bootstrap';
import * as Selector from '../selectors';
//var css = require('css!bootstrap/dist/css/bootstrap.css');
//require("!style!css!less!bootstrap/less/bootstrap.less");
require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");

//var Perf = require('react-addons-perf');

export default class Explorer extends Component {
  constructor(props) {
    super(props);
  }
  getChildContext() {
    const {explorer, dispatch, router, pushState} = this.props;
    return ({explorer, dispatch, pushState, router});
  }
  componentWillMount() {
    const {explorer, dispatch} = this.props;
    dispatch(ExplorerActions.fetchRecs(explorer.toFetch, dispatch,
      {
        recsMap: d=>{ d.value = parseFloat(d.value); return d},
        //recsFilter: d=>d,
        //postFetchAction: this.prepareDimsWhenRecsReady.bind(this)
      }));
  }
  /*
  prepareDimsWhenRecsReady(recs) {
    const { dims, dispatch } = this.props;
    _.each(dims, dim => dispatch(ExplorerActions.supergroup(dim, recs)));
  }
  */
  componentDidMount() {
    //console.log(this.props.router);
    //Perf.stop();
    //Perf.printWasted();
    //Perf.start();
  }
  render() {
    const { explorer, dispatch, router } = this.props;
    const dims = _.values(explorer.dims).filter(d=>!d.hide);
    let dimDescs = _.map(dims, 
        (dim) => {
          return <DimDesc dim={dim} key={dim.field}/>
        })
        //<Message msg={explorer.msg.general} />
    let allShown = explorer.dimsVals.all;
    // workaround for supergroup bug:
    let allShownRecs = allShown && allShown.length && allShown[0].parentList.records || [];
    let allShownMissing = allShown && allShown.length && allShown[0].lookup('Missing').records || [];
    return (
      <div>
        <Message msg={`Dims found in data records but not used:
          ${
              _.difference(explorer.dimsFoundInRecs, _.keys(explorer.dims))
                .join(', ')
          }
          `} />
        <Message 
          msg={`${explorer.filteredRecs.length} shown,
                ${allShownMissing.length ? allShownMissing.length + ' with missing value' : ''} `} />
        <Message msg={JSON.stringify(router.location.query)} />
        <div>
          {dimDescs}
        </div>
      </div>
    );
  }
}
Explorer.childContextTypes =  {
  explorer: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  pushState: React.PropTypes.func,
  router: React.PropTypes.object,
};
class DimDesc extends Component {
  render() {
    const { dim } = this.props;
    const { explorer, router, dispatch } = this.context;
    
    let sparkbars = '', vals = '', range='';
    let dimVals = explorer.dimsVals[dim.field];
    if (dimVals.length) {
      /*
      vals = _.map(dimVals, (val) => 
        <ValDesc val={val} key={val.toString()}/>);
      */
      //let barNums=_.map(dimVals, val => val.records.length);
      sparkbars = <SparkBarsChart
                        valType={"supgergroup"}
                        //vals={dimVals}
                        vals={dimVals}
                        dim={dim}
                        //barNums={barNums}
                        width={sparkWidth(dimVals)}
                        height={40} 
                        />;
    }
    if (dim.dataType && dim.dataType === 'ordinal' && dimVals)
      range = <span style={dimRangeStyle}>{d3.extent(dimVals.rawValues()).join(' - ')}</span>;

    let [highlightedDim, highlightedVal] = router.location.query.highlighted || [,];
    let dimInfo = highlightedDim === dim.field ?
            <DimInfo dim={dim} val={dimVals.lookup(highlightedVal)} /> : ''
    // can't figure out right place for this:
    // onMouseOut={()=>ExplorerActions.valHighlighted(dispatch, router)}
    return <Panel>
            <h3 style={dimTitleStyle}>{dim.name} {range}</h3>
            {sparkbars}
            {dimInfo}
            <ul>{vals}</ul>
          </Panel>
    return <div>{this.props.dim.field}</div>
  }
}
DimDesc.contextTypes =  {
  explorer: React.PropTypes.object,
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};
class DimInfo extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.val != nextProps.val;
  }
  render() {
    const { dim, val } = this.props;
    let msg = val && val.toString() || 'nothin';
    if (val) 
      return (<ValDesc dim={dim} val={val} key={val.toString()}/>);
    return <div/>;
  }
}
var dimRangeStyle = {
  paddingLeft: 20,
  fontSize: '80%',
  fontWeight: 'normal',
};
var dimTitleStyle = {
  fontFamily: 'arial',
  margin: '0px 0px 3px 0px',
};
function sparkWidth(vals) {
  var scale = d3.scale.log(10)
                .domain([1,100])
                .range([50, window.innerWidth * .95]);
  return scale(vals.length);
}
class Vals extends Component {
  render() {
    const { dim } = this.props;
    return <p>{dim.name}</p>;
  }
}
var vdctr = 0;
class ValDesc extends Component {
  render() { 
    const { dim, val } = this.props;
    const { dispatch, explorer } = this.context;
    let lcvals = '';
    if (dim.chart && val.lookup('Not Missing'))
      lcvals = <LineChart val={val.lookup('Not Missing')} />;
    //console.log('         ', ++vdctr, 'render', dim.field, val+'');

    return <Panel>
            <h4> 
                <Button bsStyle="warning" bsSize="xsmall"><Glyphicon glyph="remove-circle" 
                  onClick={()=>{dispatch(ExplorerActions.sgValMsg(null,dim))}}
                /></Button>&nbsp;
                <Button bsSize="xsmall"><Glyphicon glyph="thumbs-up" 
                  onClick={()=>{dispatch(ExplorerActions.sgValMsg(null,dim))}}
                /></Button>&nbsp;
                <Filter dim={dim} val={val} />
                &nbsp;
                {val.toString()} 
                &nbsp;
                ({val.records.length} records
                 {val.lookup('Missing') ? ', ' + val.lookup('Missing').records.length + ' missing' : ''})
            </h4>
            {lcvals}
          </Panel>;
  }
}
ValDesc.contextTypes =  {
  dispatch: React.PropTypes.func,
  //pushState: React.PropTypes.func,
  explorer: React.PropTypes.object,
  router: React.PropTypes.object,
};

export class Filter extends Component {
  render() {
    return (<Button bsSize="xsmall"><Glyphicon glyph="thumbs-down" 
              onClick={this.filterOut.bind(this)} /></Button>);
  }
  filterOut() { // replace with action
    const { pushState, explorer, router, dispatch } = this.context;
    const { dim, val } = this.props;
    //let state = explodeHash(router.location.hash);
    //debugger;
    let state = router.location.query;
    state.filters = state.filters || {};
    state.filters[dim.field] = state.filters[dim.field] || {};
    state.filters[dim.field][val] = true;
    //let newhash = buildHash(state);
    console.log(state);
    pushState(state,'',state);
    
    //debugger;
    //dispatch(ExplorerActions.filterChanged({dim:dim, val:val, setting:true}));
    /*
    let query = _.clone(router.location.query);
    query.filter = JSON.stringify(
    debugger;
    //console.log(query);
    //let newquery = Object.assign(query, {filter: 'something'});
    //console.log(query, newquery);
    //debugger;
    //let p = pushState({filter:'something'});
    pushState(null, '?filter=something');
    */
  }
}
function buildHash(obj) {
  return '#' + JSON.stringify(obj);
}
function explodeHash(hash) {
  hash = hash && hash.replace(/^#/,'') || '{}';
  return JSON.parse(hash);
}
Filter.contextTypes =  {
  dispatch: React.PropTypes.func,
  pushState: React.PropTypes.func,
  explorer: React.PropTypes.object,
  router: React.PropTypes.object,
};

Explorer.propTypes = {
  explorer: PropTypes.object.isRequired,
};
class Message extends Component {
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
  //console.log(state);
  return {
    errorMessage: state.errorMessage,
    //inputValue: state.router.location.pathname.substring(1),
    explorer: Selector.explorer(state),
    router: state.router,
    /*
    filteredRecs: Selector.filteredRecs(state),
    dims: Selector.dims(state),
    dimValsSelector: Selector.dimVals(state),
    */
  };
}

//console.log(pushState);
export default connect(mapStateToProps, 
          { /*resetErrorMessage, */ 
            pushState,
            dispatch: dispatchWrappedFunc=>dispatchWrappedFunc, 
          })(Explorer);
