import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

// external styles
import 'font-awesome/css/font-awesome.css'
import 'opensans-npm-webfont/style.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'

// iodide styles
import './style/page.css'
import './style/side-panes.css'
import './style/menu-styles.css'
import './style/cell-styles.css'

import Page from './components/page'
import { store } from './store'
import handleUrlQuery from './tools/handle-url-query'
import { createSessionId } from './tools/create-session-id'

import { listenForEvalFramePortReady } from './port-to-eval-frame'

import './tools/initialize-codemirror-loadmode'

window.IODIDE_SESSION_ID = createSessionId()

window.addEventListener('message', listenForEvalFramePortReady, false)

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.getElementById('page'),
)

handleUrlQuery()
