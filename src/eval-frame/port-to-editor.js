/* global IODIDE_BUILD_MODE */
import queryString from 'query-string'
import { store } from './store'
import { evaluateCell } from './actions/actions'
import { getCompletions } from './tools/notebook-utils'


let IODIDE_SESSION_ID = queryString.parse(window.location.search).sessionId
let { editorOrigin } = queryString.parse(window.location.search)

if (IODIDE_BUILD_MODE === 'test') {
  IODIDE_SESSION_ID = 'testing-session'
  editorOrigin = 'http://testing.origin'
}

const mc = new MessageChannel();

window.parent.postMessage(IODIDE_SESSION_ID, editorOrigin, [mc.port2]);

const portToEditor = mc.port1


export function postMessageToEditor(messageType, message) {
  portToEditor.postMessage({ messageType, message })
}

export function postActionToEditor(actionObj) {
  postMessageToEditor('REDUX_ACTION', actionObj)
}

export function postKeypressToEditor(keypressStr) {
  postMessageToEditor('KEYPRESS', keypressStr)
}

function receiveMessage(event) {
  const trustedMessage = true
  if (trustedMessage) {
    const { messageType, message } = event.data
    switch (messageType) {
      case 'REQUEST_AUTOCOMPLETE_SUGGESTIONS': {
        const {
          token, context, from, to,
        } = message
        postMessageToEditor(
          'AUTOCOMPLETION_SUGGESTIONS',
          {
            list: getCompletions(token, context),
            from,
            to,
          },
        )
        break
      }
      case 'REDUX_ACTION':
        if (message.type === 'TRIGGER_CELL_EVAL_IN_FRAME') {
          // in this one special case, we need to intecept the
          // action to fire a thunk action rather than dispatching
          // directly to the eval frame store
          store.dispatch(evaluateCell(message.cellId))
        } else {
          store.dispatch(message)
        }
        break
      default:
        console.log('unknown messageType', message)
    }
  }
}

portToEditor.onmessage = receiveMessage
