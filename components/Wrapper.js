import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ExplorerActions from '../actions/explorer';
import * as Selector from '../selectors';

/*
    <ApiWrapper apiParams={{schema, api, where, datasetLabel}}
             loadingMessage="Loading..."
    >
        <ChildComponent data=[] />
    </ApiWrapper>
 */

export class ApiWrapper extends Component {
    constructor(props) {
        super();
        this.state = {};
        this.state.apiString;
        this.state.data = props.startingData || [];
    }
    getData() {
        const {apiParams, apicall, startingData, datasets} = this.props;
        const {apiString, data} = this.state;

        if (_.isEmpty(apiParams))
            return;

        const curApiString = Selector.apiId(apiParams);
        if (apiString !== curApiString) {
            apicall(curApiString);
            this.setState({apiString: curApiString});
            return;
        }

        const loadedData = datasets[apiString];
        if (_.isEmpty(loadedData))
            return;

        if (data !== loadedData)
            this.setState({data: loadedData});
    }
    componentWillMount() {
        this.getData();
    }
    componentWillReceiveProps() {
        this.getData();
    }
    render() {
        const {preLoadingMessage, loadingMessage, 
                apiParams, children, } = this.props;
        const {apiString, data} = this.state;
        let content = preLoadingMessage;
        if (!_.isEmpty(apiParams)) {
            content = loadingMessage;
            if (!_.isEmpty(data)) {
                let newChildren = React.Children.map(children, function(child) {
                    return React.cloneElement(child, {data})
                });
                content = newChildren
            }
        }
        return (
            <div>
                {content}
            </div>
        );
    }
}
ApiWrapper.propTypes = {
    apiParams: React.PropTypes.object.isRequired,
    loadingMessage: React.PropTypes.string.isRequired,
    preLoadingMessage: React.PropTypes.string.isRequired,
    // query change stuff optional
};
ApiWrapper.defaultProps = {
    loadingMessage: 'Loading...',
    apiParams: {},
    preLoadingMessage: '',
    startingData: [],
};
ApiWrapper.contextTypes = {
    queryChange: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    explorer: React.PropTypes.object,
    router: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    explorer: Selector.explorer(state),
    router: state.router,
    datasets: state.explorer.datasets,
    schema: state.router.location.query.schema,
  };
}
export default connect(mapStateToProps,
          { /*resetErrorMessage, */ 
            dispatch: dispatchWrappedFunc=>dispatchWrappedFunc,
            apicall: ExplorerActions.apicall,
          })(ApiWrapper);
