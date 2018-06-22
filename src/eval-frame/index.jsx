import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

// external styles
import 'font-awesome/css/font-awesome.css'
import 'opensans-npm-webfont/style.css'
import 'react-table/react-table.css'
import '../../node_modules/katex/dist/katex.min.css'

// iodide styles
import './style/eval-container.css'
import './style/side-panes.css'
import './style/cell-styles.css'
import './style/default-presentation.css'

import EvalContainer from './components/eval-container'
import { store } from './store'

import { iodide } from './iodide-api/api'

import './port-to-editor'

window.iodide = iodide

render(
  <Provider store={store}>
    <EvalContainer />
  </Provider>,
  document.getElementById('page'),
)
