/* global IODIDE_EDITOR_ORIGIN  */

import { store } from './store'
import {
  evaluateText,
  // updateUserVariables
} from './actions/actions'
import { getCompletions } from './tools/notebook-utils'
import { onParentContextFileFetchSuccess, onParentContextFileFetchError } from './tools/fetch-file-from-parent-context'

const mc = new MessageChannel();

window.parent.postMessage('EVAL_FRAME_READY_MESSAGE', IODIDE_EDITOR_ORIGIN, [mc.port2]);

const portToEditor = mc.port1

export function postMessageToEditor(messageType, message) {
  portToEditor.postMessage({ messageType, message })
}

function receiveMessage(event) {
  const trustedMessage = true
  if (trustedMessage) {
    const { messageType, message } = event.data
    switch (messageType) {
      case 'STATE_UPDATE_FROM_EDITOR': {
        store.dispatch({ type: 'REPLACE_STATE', state: message })
        break
      }
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
        if (message.type === 'TRIGGER_TEXT_EVAL_IN_FRAME') {
          store.dispatch(evaluateText(
            message.evalText,
            message.evalType,
            message.evalFlags,
            message.chunkId,
          ))
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
