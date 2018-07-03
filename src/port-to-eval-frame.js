import Mousetrap from 'mousetrap'
import { store } from './store'
import { addLanguage, selectCell } from './actions/actions'

let portToEvalFrame

export function postMessageToEvalFrame(messageType, message) {
  portToEvalFrame.postMessage({ messageType, message })
}

const LINKED_ACTIONS = new Set([
  'SELECT_CELL', 'ALIGN_OUTPUT_TO_EDITOR',
])

export function postActionToEvalFrame(actionObj) {
  if (!store.getState().linkEditor) {
    if (!LINKED_ACTIONS.has(actionObj.type)) {
      postMessageToEvalFrame('REDUX_ACTION', actionObj)
    }
  } else {
    postMessageToEvalFrame('REDUX_ACTION', actionObj)
  }
}

const approvedReduxActions = [
  'ENVIRONMENT_UPDATE_FROM_EVAL_FRAME',
]

const approvedKeys = [
  'esc',
  'ctrl+s',
  'ctrl+shift+e',
  'ctrl+d',
  'ctrl+h',
]

function receiveMessage(event) {
  // console.log('eval frame port got message', event)
  const trustedMessage = true
  if (trustedMessage) {
    const { messageType, message } = event.data
    switch (messageType) {
      case 'REDUX_ACTION':
        // in this case, `message` is a redux action
        if (approvedReduxActions.includes(message.type)) {
          store.dispatch(message)
        } else {
          console.log('got unapproved redux action from eval frame!!!')
        }
        break
      case 'KEYPRESS':
        // in this case, `message` is a keypress string
        if (approvedKeys.includes(message)) {
          Mousetrap.trigger(message)
        } else {
          console.log('got unapproved key press action from eval frame!!!')
        }
        break
      case 'POST_LANGUAGE_DEF_TO_EDITOR':
        // in this case, message is a languageDefinition
        store.dispatch(addLanguage(message))
        break
      case 'CLICK_ON_OUTPUT':
        store.dispatch(selectCell(message.id, false, false))
        store.dispatch({
          type: 'ALIGN_EDITOR_CELL_TO_OUTPUT',
          cellId: message.id,
          pxFromViewportTop: message.pxFromViewportTop,
        })
        break
      default:
        console.log('unknown messageType', message)
    }
  }
}

export const listenForEvalFramePortReady = (messageEvent) => {
  console.log('listenForEvalFramePortReady', messageEvent.data)
  if (messageEvent.data === window.IODIDE_SESSION_ID) {
    portToEvalFrame = messageEvent.ports[0] /* eslint-disable-line prefer-destructuring */
    portToEvalFrame.onmessage = receiveMessage
    store.dispatch({ type: 'EVAL_FRAME_READY' })
    // stop listening for messages once a connection to the eval-frame is made
    window.removeEventListener('message', listenForEvalFramePortReady, false)
  }
}
