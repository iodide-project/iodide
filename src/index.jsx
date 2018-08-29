/* global IODIDE_EVAL_FRAME_ORIGIN IODIDE_VERSION */

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
import './style/top-level-container-styles.css'
import './style/header-bar-styles.css'
import './style/side-panes.css'
import './style/menu-and-button-and-ui-styles.css'
import './style/cell-styles.css'

import NotebookHeader from './components/menu/notebook-header'
import EditorPaneContainer from './components/editor-pane-container'
import { store } from './store'
import handleInitialJsmd from './handle-initial-jsmd'
import { initializeDefaultKeybindings } from './keybindings'


import { listenForEvalFramePortReady } from './port-to-eval-frame'

import './tools/initialize-codemirror-loadmode'

initializeDefaultKeybindings()

window.addEventListener('message', listenForEvalFramePortReady, false)

let panesContainerElt = document.getElementById('panes-container')
let iframeElt = document.getElementById('eval-frame')
// the following is provided for backward compatibility with old html
// bundles that have a 'page' element and no 'eval-frame'
if (iframeElt === null) {
  // rename 'page' to 'panes-container'
  panesContainerElt = document.getElementById('page')
  panesContainerElt.id = 'panes-container'
  // insert an iframe
  iframeElt = document.createElement('iframe')
  iframeElt.id = 'eval-frame'
  iframeElt.src = `${IODIDE_EVAL_FRAME_ORIGIN}/iodide.eval-frame.${IODIDE_VERSION}.html`
  iframeElt.setAttribute('sandbox', 'allow-scripts allow-same-origin')
  iframeElt.setAttribute('allowfullscreen', 'true')
  iframeElt.setAttribute('allowvr', 'yes')
  panesContainerElt.appendChild(iframeElt)
}

// insert the divs for the header and editor pane
const headerElt = document.createElement('div');
headerElt.id = 'notebook-header'
const editorElt = document.createElement('div');
editorElt.id = 'editor-react-root'
document.body.insertBefore(headerElt, panesContainerElt)
panesContainerElt.insertBefore(editorElt, iframeElt)


handleInitialJsmd(store)

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
