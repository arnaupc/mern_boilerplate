// Dependencies
import React from 'react';
import { BrowserRouter, Router, Route, Switch, withRouter } from 'react-router-dom';

// Components
import App from '../views/components/App';

import Dev from '../views/components/Dev';
import Error from '../views/components/Error';


const AppRoutes = () =>
  <BrowserRouter>
    <App>
    <Switch>
      <Route exact path="/" component={Dev} />
      <Route component={Error} />
      {/* Si no coindiceix amb cap url ens mostrarà la pàgina d'error */}
    </Switch>
    </App>
  </BrowserRouter>;

export default AppRoutes;
