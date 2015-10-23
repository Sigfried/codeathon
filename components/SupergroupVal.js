import React, { Component, PropTypes } from 'react';
import LineChart from './LineChart';
var _ = require('supergroup');

export default class Val extends React.Component {
  render() { 
    var val = this.props.val;
    var missing = _.supergroup(val.records, 
                      d=>d.value.length ? 
                        'Has value' : 'Missing',
                        {dimName:'Missing'});
    var withValues = missing.lookup('Has value');
    var noValues = missing.lookup('Missing');
    var lcvals = withValues ? 
            <LineChart val={withValues} /> : '';

    return <li>
            <h4>{val.toString()} 
                &nbsp;
                ({val.records.length} records
                 {noValues ? ', ' + noValues.records.length + ' missing' : ''})
                </h4>
            {lcvals}
          </li>;
  }
}

