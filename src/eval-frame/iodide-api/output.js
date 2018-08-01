import { store } from '../store'

/*
These functions operate outside of the normal React/redux update cycle
because we need to ensure that these changes to the DOM are applied
_immediately_ from user evaled code. This is ok for now b/c these user
side-effects are part of user code, and not really part of the app that
Iodide has responsibility for.

We may wish to refactor these mutations to fit into react/redux in the
future, but until we run into problems, we'll use this approach to test
things out.
*/

function sideEffectDiv(sideEffectClass, reportSideEffect) {
  // appends a side effect div to the side effect area
  const cellId = store.getState().runningCellID
  store.dispatch({ type: 'CELL_SIDE_EFFECT_STATUS', cellId, hasSideEffect: true })
  const div = document.createElement('div')
  div.setAttribute('class', sideEffectClass)
  if (reportSideEffect === false) { div.setAttribute('style', 'display:') }
  document.getElementById(`cell-${cellId}-side-effect-target`).append(div)
  return div
}

export const output = {
  text: (s, reportSideEffect = false) => {
    // dumbly puts a string in a side effect div
    const div = sideEffectDiv('side-effect-print', reportSideEffect)
    div.innerHTML = s.toString()
  },
  element: (nodeType, reportSideEffect = true) => {
    const div = sideEffectDiv('side-effect-element', reportSideEffect)
    const node = document.createElement(nodeType)
    div.append(node)
    return node
  },
}


// export function html(s) {

// }


// export function append(s) {

// }
