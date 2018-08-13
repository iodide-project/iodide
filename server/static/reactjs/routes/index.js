import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Homepage from '../pages/Homepage';
import UserPage from '../pages/UserPage';
import UserNotebook from '../pages/UserNotebook';
import Header from '../components/header';
import Footer from '../components/footer';

const routes = (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/:user" component={UserPage} />
      <Route path="/:user/:id" component={UserNotebook} />
    </Switch>
    <Footer />
  </div>
)

export default routes
