import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

import 'font-awesome/css/font-awesome.css'
import 'opensans-npm-webfont/style.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'react-table/react-table.css'
import '../node_modules/katex/dist/katex.min.css'
import './page.css'
import './default-presentation.css'

import Page from './components/page'
import { store } from './store'
import handleUrlQuery from './handle-url-query'

import { iodide } from './api'

window.iodide = iodide

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.getElementById('page'),
)

handleUrlQuery()
