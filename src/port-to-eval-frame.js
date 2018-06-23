import Mousetrap from 'mousetrap'
import { store } from './store'

let portToEvalFrame

export function postMessageToEvalFrame(messageType, message) {
  portToEvalFrame.postMessage({ messageType, message })
}

export function postActionToEvalFrame(actionObj) {
  postMessageToEvalFrame('REDUX_ACTION', actionObj)
}

const approvedReduxActions = [
  'SELECT_CELL',
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
