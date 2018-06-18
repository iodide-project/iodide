import { stateFromJsmd } from './tools/jsmd-tools'
import { newNotebook } from './state-prototypes'
// import { getSavedNotebooks } from './reducers/notebook-reducer'

function initializeNotebook() {
  const jsmdElt = document.getElementById('jsmd')
  let state
  if (jsmdElt &&
      jsmdElt.innerHTML &&
      jsmdElt.innerHTML.trim() !== '') {
    state = stateFromJsmd(jsmdElt.innerHTML)
  } else {
    state = newNotebook()
  }
  return state
}

export { initializeNotebook }
