import React, { Component, PropTypes } from 'react';
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
    var dims = this.props.dims.map( (dim,i) => {
      return <Something recs={this.props.recs} dim={dim} key={i} />
    });
    return <ul> {dims} </ul>;
  }
  componentDidUpdate() {
    return;
    console.log('supergrouping?');
    if (this.props.recs.length) {
      console.log('supergrouping');
      this.props.dims.forEach(dim => {
        //console.log('may supergroup', this.props.dim.field, 'with recs:', this.props.recs.length);
          this.props.supergroup(
            dim.field,
            this.props.recs,
            dim.field);
      });
    }
  }
  shouldComponentUpdate(prevProps, prevState) {
    console.log('checking', this.props.recs.length, prevProps.recs.length,
               'while', Object.keys(this.props));
    return this.props.recs != prevProps.recs;
  }
}
DimList.propTypes = {
  dims: PropTypes.array.isRequired,
  recs: PropTypes.array.isRequired,
};
class Something extends React.Component {
  componentDidUpdate() {
  }
  render() { 
    return <li>{this.props.dim.name}</li>;
  }
}
