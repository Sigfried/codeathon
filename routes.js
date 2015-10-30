import React from 'react';
import { Route } from 'react-router';
import DQData from './components/DQData';
import App from './containers/App';
import PickData from './components/PickData';
//import UserPage from './containers/UserPage';
//import RepoPage from './containers/RepoPage';

export default (
  <Route path="/" component={App}>
    <Route path="/"
           component={DQData} />
    <Route path="/pick"
           component={PickData} />
  </Route>
);
/*
export default (
  <Route path="/" component={DQData}>
    <Route path="/:login/:name"
           component={RepoPage} />
    <Route path="/:login"
           component={UserPage} />
  </Route>
);
*/
