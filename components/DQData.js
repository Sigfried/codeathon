import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import {DimList, Dim} from './DimList';
import {ListContainer} from './ListContainer';
import * as ExplorerActions from '../actions/explorer';
import SparkBarsChart from './SparkBars';
import LineChart from './LineChart';
import { Glyphicon, Button } from 'react-bootstrap';
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
    const {explorer, dispatch} = this.props;
    let c = ({explorer, dispatch, text:'heelo'});
    return c;
  }
  componentWillMount() {
    const {dispatch, toFetch} = this.props;
    dispatch(ExplorerActions.fetchRecs(toFetch, dispatch,
      {
        recsMap: d=>{ d.value = parseFloat(d.value); return d},
        //recsFilter: d=>d,
        postFetchAction: this.prepareDimsWhenRecsReady.bind(this)
      }));
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
    var dims = _.map(explorer.dims, 
        (dim,k) => {
          return <DimDesc dim={dim} key={dim.field}/>
        })
    return (
      <div>
        <Message foo="bar" msg={explorer.msg.general} />
        <ul>
          {dims}
        </ul>
      </div>
    );
  }
}
Explorer.childContextTypes =  {
  explorer: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  text: React.PropTypes.string,
};
class DimDesc extends Component {
  render() {
    const { dim } = this.props;
    const { explorer } = this.context;
    let sparkbars = '', vals = '', range='';
    if (dim.vals) {
      /*
      vals = _.map(dim.vals, (val) => 
        <ValDesc val={val} key={val.toString()}/>);
      */
      let barNums=_.map(dim.vals, val => val.records.length);
      sparkbars = <SparkBarsChart
                        valType={"supgergroup"}
                        vals={dim.vals}
                        dim={dim}
                        barNums={barNums}
                        width={sparkWidth(dim.vals)}
                        height={40} 
                        />;
    }
    if (dim.dataType && dim.dataType === 'ordinal' && dim.vals)
      range = <span style={dimRangeStyle}>{d3.extent(dim.vals.rawValues()).join(' - ')}</span>;

    return <li style={dimLiStyle}>
            <h3 style={dimTitleStyle}>{dim.name} {range}</h3>
            {sparkbars}
            <ul>{vals}</ul>
            <DimInfo dim={dim} val={explorer.msg[dim.field]} />
          </li>;
    return <div>{this.props.dim.field}</div>
  }
}
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
DimDesc.childContextTypes =  {
  dim: React.PropTypes.object,
};
DimDesc.contextTypes =  {
  explorer: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};
var dimLiStyle = {
  listStyle: 'none',
  //backgroundColor: '#FFF6EE',
  border: '1px dashed lightgray',
  padding: 4,
  marginBottom: 8,
};
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
                .range([50, window.innerWidth]);
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
    const { dispatch } = this.context;
    let missing = _.supergroup(val.records, 
                      d=>d.value.length ? 
                        'Has value' : 'Missing',
                        {dimName:'Missing'});
    let withValues = missing.lookup('Has value');
    let noValues = missing.lookup('Missing');
    let lcvals = '';
    if (withValues && dim.role != 'x')
      lcvals = <LineChart val={withValues} />;
    //console.log('         ', ++vdctr, 'render', dim.field, val+'');

    return <div>
            <h4> 
                <Button bsStyle="warning" bsSize="xsmall"><Glyphicon glyph="remove-circle" 
                  onClick={()=>{dispatch(ExplorerActions.sgValMsg(null,dim))}}
                /></Button>
                {val.toString()} 
                &nbsp;
                ({val.records.length} records
                 {noValues ? ', ' + noValues.records.length + ' missing' : ''})
                </h4>
            {lcvals}
          </div>;
  }
}
ValDesc.contextTypes =  {
  dispatch: React.PropTypes.func,
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
