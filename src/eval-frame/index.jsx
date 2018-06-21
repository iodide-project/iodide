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
import '../../node_modules/katex/dist/katex.min.css'

// iodide styles
import './style/page.css'
import './style/side-panes.css'
import './style/menu-styles.css'
import './style/cell-styles.css'
import './style/default-presentation.css'

import EvalContainer from './components/eval-container'
import { store } from './store'
import handleUrlQuery from './tools/handle-url-query'

import { iodide } from './iodide-api/api'

import { updateCellAndEval } from './actions/actions'

window.iodide = iodide

function receiveMessage(event) {
  console.log(event)
  const trustedMessage = true
  if (trustedMessage) {
    const { messageType, message } = JSON.parse(event.data)
    switch (messageType) {
      case 'PARENT_DISPATCH':
        store.dispatch(JSON.parse(message))
        break
      case 'UPDATE_CELL_AND_EVAL':
        store.dispatch(updateCellAndEval(JSON.parse(message)))
        break
      default:
        console.log('unknown messageType', message)
    }
  }
}

window.addEventListener('message', receiveMessage, false)
console.log('eval-frame ready for messages')
window.parent.postMessage('EVAL_FRAME_READY', '*')

render(
  <Provider store={store}>
    <EvalContainer />
  </Provider>,
  document.getElementById('page'),
)

handleUrlQuery()
