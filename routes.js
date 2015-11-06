import React from 'react';
import { Route } from 'react-router';
import SeeDims from './components/SeeDims';
import DQData from './components/DQData';
import App from './containers/App';
import Dimsetsets from './components/Dimsetsets';
//import UserPage from './containers/UserPage';
//import RepoPage from './containers/RepoPage';

export default (
  <Route path="/" component={App}>
    <Route path="/dimsetsets"
           component={Dimsetsets} />
    <Route path="/seedims"
           component={SeeDims} />
    <Route path="/dqdata"
           component={DQData} />
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
