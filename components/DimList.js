import React, { Component, PropTypes } from 'react';
import * as ExplorerActions from '../actions/explorer';
var _ = require('lodash');
/*
class CommentListContainer extends React.Component {
  constructor() {
    super();
    this.state = { comments: [] }
  }
  componentDidMount() {
    $.ajax({
      url: "/my-comments.json",
      dataType: 'json',
      success: function(comments) {
        this.setState({comments: comments});
      }.bind(this)
    });
  }
  render() {
    return <CommentList comments={this.state.comments} />;
  }
}
*/

export default class DimList extends React.Component {
  constructor(props) {
    super(props);
    debugger;
  }
  render() { 
    var dims = _.map(this.props.dims, (dim,key) => 
      <Dim recs={this.props.recs} dim={dim} key={key} supergroup={this.props.supergroup}/>);
    return <ul> {dims} </ul>;
  }
  componentWillUpdate(nextProps, nextState) {
    debugger;
  /*
    if (nextProps.recs.length) {
      _.each(this.props.dims, (dim, key) => {
        debugger;
        //if (!this.props.dims[key].vals)
        if (!dim.vals)
          this.props.supergroup( dim, nextProps.recs);
      });
    }
  */
  }
  /*
  shouldComponentUpdate(prevProps, prevState) {
    //console.log('checking', this.props.recs.length, prevProps.recs.length, 'while', Object.keys(this.props));
    console.log(this.props.dims.data_element == prevProps.dims.data_element,
      this.props.dims.data_element,prevProps.dims.data_element);
    return this.props.recs != prevProps.recs || this.props.dims.data_element != prevProps.dims.data_element;
  }
  */
}
DimList.propTypes = {
  dims: PropTypes.object.isRequired,
  recs: PropTypes.array.isRequired,
};
class Dim extends React.Component {
  /*
  shouldComponentUpdate(prevProps, prevState) {
    return this.props.dim.vals != prevProps.dim.vals;
  }
  */
  componentWillUpdate(nextProps, nextState) {
    var dim = this.props.dim;
    //debugger;
    //this.props.supergroup(dim, this.props.recs);
  }
  render() { 
    var dim = this.props.dim;
    let vals = [];
    if (dim.vals) {
      vals = _.map(dim.vals, (val) => 
        <Val val={val} key={val.toString()} />);
    }
    return <li>{dim.name}
            <ul>
              {vals}
            </ul>
          </li>;
  }
}
class Val extends React.Component {
  render() { 
    var val = this.props.val;
    return <li>
            {val.toString()} ({val.records.length})
          </li>;
  }
}
