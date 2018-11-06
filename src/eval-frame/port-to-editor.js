/* global IODIDE_EDITOR_ORIGIN */
import { store } from './store'
import { evaluateCell, updateUserVariables } from './actions/actions'
import { getCompletions } from './tools/notebook-utils'
import { onParentContextFileFetchSuccess, onParentContextFileFetchError } from './tools/fetch-file-from-parent-context'

const mc = new MessageChannel();

window.parent.postMessage('EVAL_FRAME_READY_MESSAGE', IODIDE_EDITOR_ORIGIN, [mc.port2]);

const portToEditor = mc.port1

export function postMessageToEditor(messageType, message) {
  portToEditor.postMessage({ messageType, message })
}

export function sendHealthPingToEditor() {
  postMessageToEditor('HEALTH_PING', true)
}

setInterval(sendHealthPingToEditor, 1000)

function receiveMessage(event) {
  const trustedMessage = true
  if (trustedMessage) {
    const { messageType, message } = event.data
    switch (messageType) {
      case 'REQUESTED_FILE_SUCCESS': {
        onParentContextFileFetchSuccess(message.file, message.path)
        break
      }
      case 'REQUESTED_FILE_ERROR': {
        onParentContextFileFetchError(message.reason, message.path)
        break
      }
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
        } else if (message.type === 'UPDATE_EVAL_FRAME_FROM_INITIAL_JSMD') {
          // in this case, we need to update the declared variables
          // pane to include variables that are in the environment, such as
          // the iodide API.
          store.dispatch(message)
          store.dispatch(updateUserVariables())
        } else {
          store.dispatch(message)
        }
        break
      default:
        console.error('unknown messageType', message)
    }
  }
}

portToEditor.onmessage = receiveMessage

export function postActionToEditor(actionObj) {
  postMessageToEditor('REDUX_ACTION', actionObj)
}

export function postKeypressToEditor(keypressStr) {
  postMessageToEditor('KEYPRESS', keypressStr)
}

window.onerror = () => {
  postActionToEditor({ type: 'SET_KERNEL_STATE', kernelState: 'KERNEL_ERROR' })
}

export function sendKernelStateToEditor(kernelState) {
  return postActionToEditor({ type: 'SET_KERNEL_STATE', kernelState })
}
