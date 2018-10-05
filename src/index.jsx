import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

// external styles
import 'font-awesome/css/font-awesome.css'
import 'opensans-npm-webfont/style.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-light-theme.css'

// iodide styles
import './style/top-level-container-styles.css'
import './style/header-bar-styles.css'
import './style/side-panes.css'
import './style/menu-and-button-and-ui-styles.css'
import './style/cell-styles.css'
import './style/help-modal-styles.css'
import './style/golden-layout-style-overrides.css'

import NotebookHeader from './components/menu/notebook-header'
import EditorPaneContainer from './components/editor-pane-container'
import { store } from './store'
import handleInitialJsmd from './handle-initial-jsmd'
import handleServerVariables from './handle-server-variables'
import handleLanguageDefinitions from './handle-language-definitions'
import { initializeDefaultKeybindings } from './keybindings'

import { listenForEvalFramePortReady } from './port-to-eval-frame'

import './tools/initialize-codemirror-loadmode'
import './tools/initialize-dom'

handleLanguageDefinitions(store)
initializeDefaultKeybindings()

window.addEventListener('message', listenForEvalFramePortReady, false)

handleInitialJsmd(store)
handleServerVariables(store)

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
