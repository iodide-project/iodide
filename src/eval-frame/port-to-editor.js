/* global IODIDE_EDITOR_ORIGIN */
import _ from 'lodash'
import { store } from './store'
import {
  evaluateText,
  // updateUserVariables
} from './actions/actions'
import { getCompletions } from './tools/notebook-utils'
import { onParentContextFileFetchSuccess, onParentContextFileFetchError } from './tools/fetch-file-from-parent-context'

/* eslint-disable */
function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function (result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}
/* eslint-enable */

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
        // console.log(
        //   'STATE_UPDATE_FROM_EDITOR ======= message',
        //   { messageType, message },
        // )
        // console.log(
        //   'STATE_UPDATE_FROM_EDITOR ======= ed -> eval',
        //   difference(message, store.getState()),
        // )
        // console.log(
        //   'STATE_UPDATE_FROM_EDITOR ======= eval -> ed',
        //   difference(store.getState(), message),
        // )
        // console.log(
        //   'STATE_UPDATE_FROM_EDITOR ======= states',
        //   {
        //     evalframe: store.getState(),
        //     editor: message,
        //   },
        // )
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
        // else if (message.type === 'UPDATE_EVAL_FRAME_FROM_INITIAL_JSMD') {
        //   // in this case, we need to update the declared variables
        //   // pane to include variables that are in the environment, such as
        //   // the iodide API.
        //   store.dispatch(message)
        //   store.dispatch(updateUserVariables())
        // } else {
        //   // store.dispatch(message)
        // }
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
