
import React, { Component } from 'react';
import _ from 'lodash';

export default class Icicle extends Component {

    buildTree(data, depth=1) {
        console.log("depth", depth);
        let groups = _.groupBy(data, d => d[`dim_name_${depth}`]);

        _.keys(groups).forEach(key => {
            if (_.any(groups[key].map(d => !!d[`dim_name_${depth+1}`]))) {
                groups[key] = this.buildTree(data, depth+1);
            }else{
                groups[key] = groups[key].reduce(
                    (mem, d) => mem+Number(d.records_with_values),
                    0);
            }
        });

        /* return _.keys(groups).map(key => {
           return Object.assign({name: key,
           children: groups[key]});
           }); */

        return groups;
    }

    render() {
        let tree = this.buildTree(this.props.data),
            partition = d3.layout.partition()
                          .children(d => d.records ? null : d3.entries(d.value))
                          .value(d => d.records);

        console.log(tree, d3.entries(tree));

        return (
            <h1>Hello there</h1>
        );
    }
};
