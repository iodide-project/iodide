import queryString from 'query-string'
import { store } from './store'
import { updateCellAndEval, evaluateCell } from './actions/actions'


const IODIDE_SESSION_ID = queryString.parse(window.location.search).sessionId
const { editorOrigin } = queryString.parse(window.location.search)
// console.log(`sessionId:${IODIDE_SESSION_ID}, editorOrigin:${editorOrigin}`)


function receiveMessage(event) {
  // console.log('eval frame port got message', event)
  const trustedMessage = true
  if (trustedMessage) {
    const { messageType, message } = event.data
    switch (messageType) {
      case 'REDUX_ACTION':
        store.dispatch(message)
        break
      case 'UPDATE_CELL_AND_EVAL':
        store.dispatch(updateCellAndEval(JSON.parse(message)))
        break
      case 'TRIGGER_CELL_EVAL':
        store.dispatch(evaluateCell(message))
        break
      default:
        console.log('unknown messageType', message)
    }
  }
}

const mc = new MessageChannel();

window.parent.postMessage(`EVAL_FRAME_PORT_READY|${IODIDE_SESSION_ID}`, editorOrigin, [mc.port2]);

const portToEditor = mc.port1

portToEditor.onmessage = receiveMessage

export function postMessageToEditor(messageType, message) {
  portToEditor.postMessage({ messageType, message })
}

export function postActionToEditor(actionObj) {
  postMessageToEditor('REDUX_ACTION', actionObj)
}

