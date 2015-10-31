import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Table, Column } from 'fixed-data-table';
import _ from 'supergroup';
//var css = require("css!./lineChart.css"); // hitting some bug...won't compile
// including dist/fixed-data-table.css from index.html
//import d3 from 'd3';
var rows = [
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  // .... and more
];

export default class DataTable extends Component {
    render() {
      const { val, dims } = this.props;
      if (!(val && val.records && val.records.length))
        return (<div/>);

      let colidx = 0;
      const columns = _.chain(val.records[0])
        .pairs().map(
        (colname, colval1) => {
          console.log(colname, colval1);
          return (
                <Column
                  isResizable={true}
                  label={colname}
                  width={75}
                  dataKey={colidx++}
                  key={colidx++}
                />);
        }).value();
      console.log(columns);
                  //width={colval1.length + 'em'}

      function rowGetter(rowIndex) {
        return _.values(val.records[rowIndex]);
      }
      function resize(newWidth, datakey) {
        console.log(newWidth, datakey);
        debugger;
      }
      return ( 
              <div>
              <Table
                onColumnResizeEndCallback={resize}
                rowHeight={50}
                rowGetter={rowGetter}
                rowsCount={val.records.length}
                width={800}
                height={300}
                headerHeight={30}>
                {columns}
              </Table>
              </div>
            );
    }
}
