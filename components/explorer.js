import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

class Explorer extends Component {
    constructor(props, context) {
      super(props, context);
    }
    render() {
      console.log(this);
      return (
        <div>
          <h1>Explorer</h1>
          data keys: {Object.keys(this.props.data)}
          <br/>
          recs: {this.props.data.recs.length}
        </div>);
    }
    componentWillMount() {
      //this.props.test('hi');
      const { dispatch } = this.props;
      console.log(this, dispatch);
      this.props.fetchData(this.props.toFetch);
    }
    componentDidMount() {
      //this.context.store.dispatch({action:'initialize'});
      console.log(this);
      //this.props.fetchData(this.props.toFetch);
    }
    clickChart(e) {
      this.props.onChartClick('hello');
      this.props.fetchData();
    }
}

Explorer.propTypes = {
  //recs: PropTypes.array.isRequired,
  toFetch: PropTypes.string.isRequired,
};

export default Explorer;


