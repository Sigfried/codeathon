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
  render() { 
    var dims = _.map(this.props.dims, (dim,key) => 
      <Dim recs={this.props.recs} dim={dim} key={key} />);
    return <ul> {dims} </ul>;
  }
  componentDidUpdate() {
    if (this.props.recs.length) {
      //debugger;
      _.each(this.props.dims, (dim) =>
          this.props.supergroup( dim, this.props.recs));
    }
  }
  shouldComponentUpdate(prevProps, prevState) {
    //console.log('checking', this.props.recs.length, prevProps.recs.length, 'while', Object.keys(this.props));
    return this.props.recs != prevProps.recs;
  }
}
DimList.propTypes = {
  dims: PropTypes.object.isRequired,
  recs: PropTypes.array.isRequired,
};
class Dim extends React.Component {
  render() { 
    var vals = [];
    if (this.props.dim.vals) {
      vals = _.map(this.props.dim.vals, (val) => 
        <Val val={val} key={val.toString()} />);
    }
    return <li>{this.props.dim.name}
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
