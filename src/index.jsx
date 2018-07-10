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

import NotebookHeader from './components/menu/notebook-header'
import EditorPaneContainer from './components/editor-pane-container'
import { store } from './store'
import handleUrlQuery from './tools/handle-url-query'
import { createSessionId } from './tools/create-session-id'
import autosaveStart from './tools/autosave'
import { initializeDefaultKeybindings } from './keybindings'


import { listenForEvalFramePortReady } from './port-to-eval-frame'

import './tools/initialize-codemirror-loadmode'

initializeDefaultKeybindings()

window.IODIDE_SESSION_ID = createSessionId()

window.addEventListener('message', listenForEvalFramePortReady, false)

render(
  <Provider store={store}>
    <NotebookHeader />
  </Provider>,
  document.getElementById('notebook-header'),
)

render(
  <Provider store={store}>
    <EditorPaneContainer />
  </Provider>,
  document.getElementById('editor-react-root'),
)

autosaveStart(store)

handleUrlQuery()
