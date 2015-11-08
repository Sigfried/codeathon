
import React, { Component } from 'react';
import _ from 'supergroup';

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

        return groups;
    }

    render() {
        const { data } = this.props;
        var sg = _.supergroup(data,['dim_name_1','dim_name_2','dim_name_3','dim_name_4','dim_name_5','dim_name_6']);
        let tree = sg.asRootVal();
        let partition = d3.layout.partition()
                          .children(d => isNaN(d.value) ? d3.entries(d.value) : null)
                          .value(d => d.value);

        console.log(partition(tree));

        return (
            <h1>Hello there</h1>
        );
    }
};
