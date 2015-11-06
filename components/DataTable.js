import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Table, Column } from 'fixed-data-table';
import _ from 'supergroup';
//var css = require("css!./lineChart.css"); // hitting some bug...won't compile
// including dist/fixed-data-table.css from index.html
//import d3 from 'd3';

export default class DataTable extends Component {
    render() {
      const { recs } = this.props;
      if (!(recs && recs.length))
        return (<div/>);

      let colidx = 0;
      const columns = _.chain(recs[0])
        .keys().map(col => {
          return (
                <Column
                  isResizable={true}
                  label={col}
                  width={(_.chain(recs)
                    .pluck(col)
                    .pluck('length')
                    .max()
                    .value() + 10) * 7}
                  dataKey={colidx++}
                  key={colidx}
                />);
        }).value();
      //console.log(columns);
                  //width={colval1.length + 'em'}

      function rowGetter(rowIndex) {
        let row = _.values(recs[rowIndex])
        return row;
      }
      function resize(newWidth, datakey) {
        //console.log(newWidth, datakey);
        debugger;
      }
      return ( 
            <div>
              <Table
                onColumnResizeEndCallback={resize}
                onRowClick={
                  (evt,idx,row)=>
                    this.props.rowClick(recs[idx])}
                rowHeight={25}
                rowGetter={rowGetter}
                rowsCount={recs.length}
                width={800}
                height={300}
                headerHeight={40}>
                {columns}
              </Table>
            </div>
            );
    }
}
