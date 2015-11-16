import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import {DimList, Dim} from './DimList';
//import {ListContainer} from './ListContainer';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import LineChart from './LineChart';
import DataTable from './DataTable';
import { Glyphicon, Button, Panel, ButtonToolbar } from 'react-bootstrap';
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
    const {explorer, dispatch, router, } = this.props;
    return ({explorer, dispatch, router});
  }
  componentWillMount() {
    this.getData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.schema !== this.props.schema ||
        prevProps.dimsetset !== this.props.dimsetset)
      this.getData();
  }
  getData() {
    const {explorer, dispatch, schema, dimsetset} = this.props;
    dispatch(ExplorerActions.fetchRecs(schema, 
          explorer.config.toFetch, 
          {dimsetset: dimsetset},
          dispatch,
      {
        recsMap: d=>{ d.value = parseFloat(d.value); return d},
        recsFilter: d=>d.value.length,
        //postFetchAction: this.prepareDimsWhenRecsReady.bind(this)
      }));
  }
  prepareDimsWhenRecsReady(recs) {
    const { dims, dispatch, explorer } = this.props;
    //_.each(dims, dim => dispatch(ExplorerActions.supergroup(dim, recs)));
    //dispatch(ExplorerActions.addExtraDims(explorer.extraDims));
  }
  componentDidMount() {
    //console.log(this.props.router);
    //Perf.stop();
    //Perf.printWasted();
    //Perf.start();
  }
  render() {
    const { explorer, dispatch, router, schema, dimsetset } = this.props;
    const dims = _.values(explorer.dims).filter(d=>!d.hide);
    let dimDescs = _.map(dims, 
        (dim) => {
          return (
            <div style={styles.dimDesc} key={dim.field}>
              <DimDesc style={ExpStyle} dim={dim} 
                sparkbarWidth={window.innerWidth * 0.50}/>
            </div>);
        })
        //<Message msg={explorer.msg.general} />
    let allShown = explorer.dimsVals.all;
    // workaround for supergroup bug:
    let allShownRecs = allShown && allShown.length && allShown[0].parentList && allShown[0].parentList.records || [];
    let allShownMissing = allShown && allShown.length && allShown[0].lookup('Missing') && allShown[0].lookup('Missing').records || [];
        //<Message msg={`Dims found in data records but not used: ${explorer.extraDims.join(', ')} `} />
    return (
      <div style={ExpStyle}>
        <h1>DQ Data Explorer -- {schema}</h1>
        <Message 
          msg={`${explorer.recs.length} records,
                ${explorer.filteredRecs.length} shown,
                ${allShownMissing.length ? allShownMissing.length + ' with missing value' : ''} `} />
        <div>
          {dimDescs}
        </div>
      </div>
    );
        //<Message msg={JSON.stringify(router.location.query)} />
  }
}
let ExpStyle = {
  //fontSize: '70%',
};
Explorer.propTypes = {
  explorer: PropTypes.object.isRequired,
  dispatch: React.PropTypes.func,
  router: React.PropTypes.object,
  schema: React.PropTypes.string.isRequired,
  dimsetset: React.PropTypes.string.isRequired,
  recs: React.PropTypes.array.isRequired,
};
Explorer.childContextTypes =  {
  explorer: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  router: React.PropTypes.object,
};
let styles = {
  dimDesc: {
    width: '70%',
  },
  dimRangeStyle: {
    paddingLeft: 20,
    //fontSize: '80%',
    fontWeight: 'normal',
  },
  dimTitleStyle: {
    fontFamily: 'arial',
    fontSize: 14,
    margin: '0px 0px 3px 0px',
  },
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
                        notmissing={true}
                        //vals={dimVals}
                        vals={dimVals}
                        isHighlighted={explorer.isValHighlighted}
                        highlight={(dim,val)=>
                          ExplorerActions.valHighlighted(dispatch,router,dim,val)}
                        highlighted={explorer.highlighted}
                        dim={dim}
                        //barNums={barNums}
                        width={sparkWidth(dimVals, this.props.sparkbarWidth)}
                        height={40} 
                        />;
    }
    if (dim.dataType && dim.dataType === 'ordinal' && dimVals)
      range = <span style={styles.dimRangeStyle}>{d3.extent(dimVals.rawValues()).join(' - ')}</span>;

    let dimInfo = '';
    if (explorer.isDimHighlighted(dim)) {
      let val = dimVals.lookup(explorer.highlightedVal);
      if (val)
        dimInfo = <DimInfo style={this.props.style} 
                      defaultStyle={this.props.defaultStyle}
                      dim={dim} val={val} />;
    }
    // can't figure out right place for this:
    // onMouseOut={()=>ExplorerActions.valHighlighted(dispatch, router)}
    return <div style={Object.assign({}, 
                          this.props.defaultStyle,
                          this.props.style)} 
                  ref='dimDesc'>
           <Panel>
            <h3 style={styles.dimTitleStyle}>{dim.name} {range}</h3>
            {sparkbars}
            {dimInfo}
            <FilterExclusions 
                dimVals={Selector.dimVals(dim,explorer.recs)} 
                vals={explorer.filteredVals(dim)} 
                dim={dim}
                dispatch={dispatch}
                router={router}
                />
            <ul>{vals}</ul>
           </Panel>
          </div>
    return <div>{this.props.dim.field}</div>
  }
}
function sparkWidth(vals, width) {
  var scale = d3.scale.log(10)
                .domain([1,100])
                .range([50, width]);
  return scale(vals.length);
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
class ValDesc extends Component {
  /*
  shouldComponentUpdate(nextProps) {
    return this.props.val != nextProps.val;
  }
  */
  render() { 
    const { dim, val } = this.props;
    const { dispatch, explorer } = this.context;
    let lineChart = '';
    if (dim.chart && val.lookup('Not Missing'))
      lineChart = <LineChart val={val.lookup('Not Missing')} />;

    return <div>
            <h4 style={styles.dimTitleStyle}> 
                <ButtonToolbar>
                  <Button bsStyle="warning" bsSize="xsmall"><Glyphicon glyph="remove-circle" 
                    title="Filter out"
                    onClick={()=>{dispatch(ExplorerActions.sgValMsg(null,dim))}}
                  /></Button>
                  <Filter dim={dim} val={val} />
                </ButtonToolbar>
                &nbsp;
                {val.toString()} 
                &nbsp;
                ({val.records.length} records
                 {val.lookup('Missing') ? ', ' + val.lookup('Missing').records.length + ' missing' : ''})
            </h4>
            <DataTable val={val} dims={explorer.dims}/>
            {lineChart}
          </div>;
  }
}
ValDesc.contextTypes =  {
  dispatch: React.PropTypes.func,
  explorer: React.PropTypes.object,
  router: React.PropTypes.object,
};
class FilterExclusions extends Component {
  render() {
    const {dimVals, vals, dispatch, router, dim} = this.props;
    let cancel = val => () => ExplorerActions.filterOut(dispatch, router, dim, val, false);
    let buttons = dimVals.length && vals.length && vals.map(val =>
      <Button 
          onClick={cancel(val)}
          bsStyle="warning" bsSize="xsmall" key={val}>
        {val}
      </Button>
    ) || '';

    return (<div>{buttons.length && 'Filter exclusions: ' || ''}
              <ButtonToolbar>{buttons}</ButtonToolbar>
              </div>);
  }
}

export class Filter extends Component {
  render() {
    return (<Button bsSize="xsmall"><Glyphicon glyph="thumbs-down" 
              onClick={this.filterOut.bind(this)} /></Button>);
  }
  filterOut() { // replace with action
    const { explorer, router, dispatch } = this.context;
    const { dim, val } = this.props;
    ExplorerActions.filterOut(dispatch, router, dim, val);
  }
}
Filter.contextTypes =  {
  dispatch: React.PropTypes.func,
  explorer: React.PropTypes.object,
  router: React.PropTypes.object,
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
    explorer: Selector.explorer(state),
    router: state.router,
  };
}

export default connect(mapStateToProps, 
          { /*resetErrorMessage, */ 
            dispatch: dispatchWrappedFunc=>dispatchWrappedFunc, 
          })(Explorer);
