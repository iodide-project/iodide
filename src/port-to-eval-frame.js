import Mousetrap from 'mousetrap'
import { store } from './store'
import { addLanguage, selectCell, setKernelState } from './actions/actions'
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
  'SET_KERNEL_STATE',
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

// health ping interval
let timeSince = new Date()
setInterval(() => {
  if (store.getState().evalFrameReady && new Date() - timeSince >= 2000) {
    store.dispatch(setKernelState('KERNEL_ERROR'))
  }
}, 2 * 1000)

// if initial frame doesn't load in K seconds, throw a KERNEL_LOAD_ERROR

setTimeout(() => {
  if (!store.getState().evalFrameReady) {
    store.dispatch(setKernelState('KERNEL_LOAD_ERROR'))
  }
}, 10 * 1000)

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
      case 'CLICK_ON_OUTPUT':
        if (message.autoScrollToCell === undefined) { message.autoScrollToCell = false }
        store.dispatch(selectCell(message.id, message.autoScrollToCell, message.pxFromViewportTop))
        break
      case 'HEALTH_PING':
        timeSince = new Date()
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
    store.dispatch(setKernelState('KERNEL_IDLE'))
    // stop listening for messages once a connection to the eval-frame is made
    window.removeEventListener('message', listenForEvalFramePortReady, false)
  }
}
