import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from '../components/Header';
import Homepage from '../pages/Homepage';
import UserPage from '../pages/UserPage';
import UserNotebook from '../pages/UserNotebook';

const routes = (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/:user" component={UserPage} />
      <Route path="/:user/:id" component={UserNotebook} />
    </Switch>
  </div>
)

export default routes
