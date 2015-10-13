import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

class Explorer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div>
        <h1>Explorer</h1>
        data keys: {Object.keys(this.props.data).join(', ')}
        <br/>
        recs: {this.props.data.recs.length}
      </div>);
  }
  componentWillMount() {
    var self = this;
    this.props.fetchData(this.props.toFetch)
      .then(() => console.log(this.props.data))
      .then(function() {
        self.props.supergroup(
        'dataElement',self.props.data.recs, 'data_element');
      });
  }
}

Explorer.propTypes = {
  //recs: PropTypes.array.isRequired,
  toFetch: PropTypes.string.isRequired,
};

export default Explorer;


