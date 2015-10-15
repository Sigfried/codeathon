import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import reducer from '../reducers';

var middleware = [];
middleware.push(thunk);
middleware.push(promise);
middleware.push(createLogger({duration:true}));
if (process.env.NODE_ENV !== 'production')
  middleware.push(require('redux-immutable-state-invariant')());

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
