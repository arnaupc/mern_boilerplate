// Dependencies
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

// Routes
import AppRoutes from './routes/app_react';

// Assets
import './views/index.css';

render(
  <AppRoutes />,
  document.getElementById('root')
);
