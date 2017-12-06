import React from 'react'
import { Provider } from 'react-redux'
import {render} from 'react-dom'
import Page from './page.jsx'
import {store} from './store.jsx'

render(
  <Provider store={store}>
    <Page />
  </Provider>, document.getElementById('page'))