import React from 'react'
import { Provider } from 'react-redux'
import {render} from 'react-dom'

import 'font-awesome/css/font-awesome.css';
import 'opensans-npm-webfont';
import 'bootstrap/dist/css/bootstrap.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/lib/codemirror.css';
import 'react-table/react-table.css';
import './page.css';

import Page from './components/page.jsx'
import {store} from './store.js'

import './tools/nd.js';

render(
  <Provider store={store}>
    <Page />
  </Provider>, document.getElementById('page'))
