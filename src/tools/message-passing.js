export function postTypedMessageToEvalContext(messageType, message) {
  console.log('window.IODIDE_EVAL_FRAME:', window.IODIDE_EVAL_FRAME, messageType, message)
  if (window.IODIDE_EVAL_FRAME) {
    window.IODIDE_EVAL_FRAME.contentWindow.postMessage(JSON.stringify({ messageType, message }), '*')
  }
}

export function postDispatchToEvalContext(actionObj) {
  postTypedMessageToEvalContext('PARENT_DISPATCH', JSON.stringify(actionObj))
}
