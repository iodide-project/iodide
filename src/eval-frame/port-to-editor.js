/* global IODIDE_EDITOR_ORIGIN */
import { store } from './store'
import { evaluateCell } from './actions/actions'

function receiveMessage(event) {
  const trustedMessage = true
  if (trustedMessage) {
    const { messageType, message } = event.data
    switch (messageType) {
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

const mc = new MessageChannel();

window.parent.postMessage('EVAL_FRAME_READY_MESSAGE', IODIDE_EDITOR_ORIGIN, [mc.port2]);

const portToEditor = mc.port1

portToEditor.onmessage = receiveMessage

export function postMessageToEditor(messageType, message) {
  portToEditor.postMessage({ messageType, message })
}

export function postActionToEditor(actionObj) {
  postMessageToEditor('REDUX_ACTION', actionObj)
}

export function postKeypressToEditor(keypressStr) {
  postMessageToEditor('KEYPRESS', keypressStr)
}
