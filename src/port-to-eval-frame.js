import { store } from './store'

let portToEvalFrame

export function postMessageToEvalFrame(messageType, message) {
  portToEvalFrame.postMessage({ messageType, message })
}

export function postActionToEvalFrame(actionObj) {
  postMessageToEvalFrame('REDUX_ACTION', actionObj)
}


export function listenForEvalFramePortReady(messageEvent) {
  console.log('listenForEvalFramePortReady', messageEvent.data)
  if (messageEvent.data.split('|')[1] === window.IODIDE_SESSION_ID) {
    portToEvalFrame = messageEvent.ports[0] /* eslint-disable-line prefer-destructuring */
  }
  store.dispatch({ type: 'EVAL_FRAME_READY' })
  postMessageToEvalFrame('TEST_MESSAGE', 'asdfasfrejnlrnl')

  // this works:
  // postMessageToEvalFrame('REDUX_ACTION', { type: 'SET_VIEW_MODE', viewMode: 'presentation' })
}
