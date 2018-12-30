import Mousetrap from 'mousetrap'
import { store } from './store'
import { addLanguage } from './actions/actions'
import { genericFetch as fetchFileFromServer } from './tools/fetch-tools'

let portToEvalFrame

export function postMessageToEvalFrame(messageType, message) {
  portToEvalFrame.postMessage({ messageType, message })
}

export function postActionToEvalFrame(actionObj) {
  postMessageToEvalFrame('REDUX_ACTION', actionObj)
}

const approvedReduxActionsFromEvalFrame = [
  'ENVIRONMENT_UPDATE_FROM_EVAL_FRAME',
  'CHANGE_SIDE_PANE_MODE',
  'TOGGLE_EDITOR_LINK',
]

const approvedKeys = [
  'esc',
  'ctrl+s',
  'ctrl+shift+e',
  'ctrl+d',
  'ctrl+h',
  'ctrl+i',
  'ctrl+shift+left',
  'ctrl+shift+right',
]

function receiveMessage(event) {
  const trustedMessage = true
  if (trustedMessage) {
    const { messageType, message } = event.data
    switch (messageType) {
      case 'REQUEST_FETCH': {
        fetchFileFromServer(message.path, message.fetchType)
          .then((file) => {
            postMessageToEvalFrame('REQUESTED_FILE_SUCCESS', {
              file,
              path: message.path,
            })
          }).catch((err) => {
            postMessageToEvalFrame('REQUESTED_FILE_ERROR', {
              path: message.path,
              reason: err.message,
            })
          })
        break
      }
      case 'AUTOCOMPLETION_SUGGESTIONS': {
        const hintOptions = {
          disableKeywords: true,
          completeSingle: false,
          completeOnSingleClick: false,
        }
        // CodeMirror is actually already in the global namespace.
        CodeMirror.showHint(window.ACTIVE_EDITOR_REF, () => message, hintOptions) // eslint-disable-line
        window.ACTIVE_EDITOR_REF = undefined
        break
      }
      case 'REDUX_ACTION':
        // in this case, `message` is a redux action
        if (approvedReduxActionsFromEvalFrame.includes(message.type)) {
          store.dispatch(message)
        } else {
          console.error(`got unapproved redux action from eval frame: ${message.type}`)
        }
        break
      case 'KEYPRESS':
        // in this case, `message` is a keypress string
        if (approvedKeys.includes(message)) {
          Mousetrap.trigger(message)
        } else {
          console.error(`got unapproved key press action from eval frame: ${message}`)
        }
        break
      case 'POST_LANGUAGE_DEF_TO_EDITOR':
        // in this case, message is a languageDefinition
        store.dispatch(addLanguage(message))
        break
      default:
        console.error('unknown messageType', message)
    }
  }
}

export const listenForEvalFramePortReady = (messageEvent) => {
  console.log('listenForEvalFramePortReady', messageEvent.data, messageEvent.origin)
  if (messageEvent.data === 'EVAL_FRAME_READY_MESSAGE') {
    portToEvalFrame = messageEvent.ports[0] // eslint-disable-line
    portToEvalFrame.onmessage = receiveMessage
    store.dispatch({ type: 'EVAL_FRAME_READY' })
    // stop listening for messages once a connection to the eval-frame is made
    window.removeEventListener('message', listenForEvalFramePortReady, false)
  }
}
