import { stateFromJsmd } from './jsmd-tools'
import { newNotebook } from './state-prototypes'


function initializeNotebook() {
  const jsmdElt = document.getElementById('jsmd')
  if (jsmdElt &&
      jsmdElt.innerHTML &&
      jsmdElt.innerHTML.trim() !== '') {
    return stateFromJsmd(jsmdElt.innerHTML)
  }
  return newNotebook()
}

export { initializeNotebook }
