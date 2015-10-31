import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Table, Column } from 'fixed-data-table';
//var css = require("css!./lineChart.css"); // hitting some bug...won't compile
// including dist/fixed-data-table.css from index.html
//import d3 from 'd3';
var rows = [
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  // .... and more
];

function rowGetter(rowIndex) {
  return rows[rowIndex];
}
export default function PickData() {
ReactDOM.render(
  <Table
    rowHeight={50}
    rowGetter={rowGetter}
    rowsCount={rows.length}
    width={5000}
    height={5000}
    headerHeight={50}>
    <Column
      label="Col 1"
      width={3000}
      dataKey={0}
    />
    <Column
      label="Col 2"
      width={2000}
      dataKey={1}
    />
  </Table>,
  document.getElementsByTagName('body')[0]
);
}
/*
export default class PickData extends Component {
    render() {
      console.log('in pickdata!');
      return ( 
              <div><h2>hi</h2>
              <Table
                rowHeight={50}
                rowGetter={rowGetter}
                rowsCount={rows.length}
                width={5000}
                height={5000}
                headerHeight={50}>
                <Column
                  label="Col 1"
                  width={3000}
                  dataKey={0}
                />
                <Column
                  label="Col 2"
                  width={2000}
                  dataKey={1}
                />
              </Table>
              </div>
            );
    }
}
*/
