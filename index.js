import React from 'react';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';

const store = configureStore();

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.getElementById('root')
);

/*
var data=[23,34,54,32,34,22,36,26];
React.render(
  <SparkBarsChart barts={data} height={50} width={150}>
    {() => <App />}
  </SparkBarsChart>,
  document.getElementById('sparkbars')
);
*/
