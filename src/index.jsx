import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

// external styles
import 'font-awesome/css/font-awesome.css'
import 'opensans-npm-webfont/style.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'react-table/react-table.css'
import '../node_modules/katex/dist/katex.min.css'

// iodide styles
import './style/page.css'
import './style/side-panes.css'
import './style/menu-styles.css'
import './style/cell-styles.css'
import './style/default-presentation.css'

import Page from './components/page'
import { store } from './store'
import handleUrlQuery from './tools/handle-url-query'

import { iodide } from './iodide-api/api'

window.iodide = iodide

export function receiveMessage(event) {
  console.log(event)
  const trustedMessage = true
  if (trustedMessage) {
    // const { messageType, message } = JSON.parse()
    console.log('parent got message', event)
    switch (event.data) {
      case 'EVAL_FRAME_READY':
        console.log('parent ack EVAL_FRAME_READY')
        store.dispatch({ type: 'EVAL_FRAME_READY' })
        break
      default:
        console.log('unknown messageType', event.data)
    }
  }
}

window.addEventListener('message', receiveMessage, false)

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.getElementById('page'),
)

handleUrlQuery()
