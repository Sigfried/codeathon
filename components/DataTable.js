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
        .pairs().map(
        (colname, colval1) => {
          //console.log(colname, colval1);
          return (
                <Column
                  isResizable={true}
                  label={colname}
                  width={75}
                  dataKey={colidx++}
                  key={colidx++}
                />);
        }).value();
      //console.log(columns);
                  //width={colval1.length + 'em'}

      function rowGetter(rowIndex) {
        return _.values(recs[rowIndex]);
      }
      function resize(newWidth, datakey) {
        //console.log(newWidth, datakey);
        debugger;
      }
      return ( 
              <div>
              <Table
                onColumnResizeEndCallback={resize}
                rowHeight={50}
                rowGetter={rowGetter}
                rowsCount={recs.length}
                width={800}
                height={300}
                headerHeight={30}>
                {columns}
              </Table>
              </div>
            );
    }
}
