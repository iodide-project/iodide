import {store} from './store'
import actions from './actions'
import {isCommandMode,
  viewModeIsEditor,
  getCellBelowSelectedId,
  getCellAboveSelectedId} from './notebook-utils'

let jupyterKeybindings = []

// this just allows calling:
// dispatcher.action(params)
// instead of
// store.dispatch(actions.action(...params)
let dispatcher = {}
for (let action in actions){
  dispatcher[action] = (...params) => (store.dispatch(actions[action](...params)))
}


let MOVE_UP = [['shift+up'], function(){
  if (isCommandMode()) dispatcher.cellUp()
}
]

let MOVE_DOWN = [['shift+down'], function(){
  if (isCommandMode()) dispatcher.cellDown()
}
]

let ADD_CELL_ABOVE = [['a'], function(){
  if (isCommandMode()) {
    dispatcher.insertCell('javascript', 'above')
    dispatcher.selectCell(getCellAboveSelectedId(), true)
  }
}
]

let ADD_CELL_BELOW = [['b'], function(){
  if (isCommandMode()) {
    dispatcher.insertCell('javascript', 'below')
    dispatcher.selectCell(getCellBelowSelectedId(), true)
  }
}
]

let JAVASCRIPT_MODE = [['j'], function(){
  if (isCommandMode()) dispatcher.changeCellType('javascript')
}
]

let MARKDOWN_MODE = [['m'], function(){
  if (isCommandMode()) dispatcher.changeCellType('markdown')
}
]

let EXTERNAL_DEPENDENCIES_MODE = [['e'], function(){
  if (isCommandMode()) dispatcher.changeCellType('external dependencies')
}
]

let RAW_MODE = [['r'], function(){
  if (isCommandMode()) dispatcher.changeCellType('raw')
}
]

let CSS_MODE = [['c'], function(){
  if (isCommandMode()) dispatcher.changeCellType('css')
}
]

let DOM_MODE = [['d'], function(){
  if (isCommandMode()) dispatcher.changeCellType('dom')
}
]

let SAVE_NOTEBOOK = [['ctrl+s', 'meta+s'], function(e){
  if (e.preventDefault) {
    e.preventDefault()
  } else {e.returnValue = false }
  dispatcher.saveNotebook(store.getState().title)
}]

let EXPORT_NOTEBOOK = [['ctrl+e', 'meta+e'], function(){
  // if (e.preventDfault) e.preventDefault()
  // else e.returnValue = false
  dispatcher.exportNotebook()
}]

let SHOW_DECLARED_VARIABLES = [['ctrl+d', 'meta+d'], function(e){
  if (e.preventDefault) {
    e.preventDefault()
  } else {e.returnValue = false }
  if (store.getState().sidePaneMode !=='declared variables'){
    dispatcher.changeSidePaneMode('declared variables')
  } else {
    dispatcher.changeSidePaneMode()
  }
}]

let SHOW_HISTORY = [['ctrl+h', 'meta+h'], function(e){
  if (e.preventDefault) {
    e.preventDefault()
  } else {e.returnValue = false }
  if (store.getState().sidePaneMode !=='history'){
    dispatcher.changeSidePaneMode('history')
  } else {
    dispatcher.changeSidePaneMode()
  }
}]

let SELECT_UP = [['up'], function(e){
  if (isCommandMode()){
    // e.preventDefault blocks kbd scrolling of entire window
    if (e.preventDefault) {
      e.preventDefault()
    } else { // internet explorer
      e.returnValue = false
    }
    dispatcher.selectCell(getCellAboveSelectedId(), true)
  }
}
]

let SELECT_DOWN = [['down'], function(e){
  if (isCommandMode()){
    // e.preventDefault blocks kbd scrolling of entire window
    if (e.preventDefault) {
      e.preventDefault()
    } else { // internet explorer
      e.returnValue = false
    }
    dispatcher.selectCell(getCellBelowSelectedId(), true)
  }
}
]

let EVALUATE_CELL = [['mod+enter'], function(){
  dispatcher.changeMode('command')
  dispatcher.evaluateCell()
}]

let EVAL_AND_SELECT_BELOW = [['shift+enter'], function(){
  if (viewModeIsEditor()) {
    dispatcher.changeMode('command')
    dispatcher.evaluateCell()
    let cellBelowId = getCellBelowSelectedId()
    if (cellBelowId){
      dispatcher.selectCell(cellBelowId, true)
    } else {
      dispatcher.addCell('javascript')
      dispatcher.selectCell(getCellBelowSelectedId(), true)
    }
  }
    
}]

let COMMAND_MODE = [['esc'], function(){
  dispatcher.changeMode('command')
}]

let EDIT_MODE = [['enter', 'return'], function(e){
  if (isCommandMode()){
    // e.preventDefault blocks inserting a newline when you transition to edit mode
    if (e.preventDefault) {
      e.preventDefault()
    } else { // internet explorer
      e.returnValue = false
    }
    dispatcher.changeMode('edit')
  }
}]

let DELETE_CELL = [['shift+del', 'shift+backspace'], function(){
  if (isCommandMode()) dispatcher.deleteCell()
}
]

jupyterKeybindings.push(JAVASCRIPT_MODE)
jupyterKeybindings.push(MARKDOWN_MODE)
jupyterKeybindings.push(EXTERNAL_DEPENDENCIES_MODE)
jupyterKeybindings.push(RAW_MODE)
jupyterKeybindings.push(CSS_MODE)
jupyterKeybindings.push(DOM_MODE)
jupyterKeybindings.push(SELECT_UP)
jupyterKeybindings.push(SELECT_DOWN)
jupyterKeybindings.push(ADD_CELL_ABOVE)
jupyterKeybindings.push(ADD_CELL_BELOW)
jupyterKeybindings.push(MOVE_UP)
jupyterKeybindings.push(MOVE_DOWN)
jupyterKeybindings.push(EDIT_MODE)
jupyterKeybindings.push(COMMAND_MODE)
jupyterKeybindings.push(EVALUATE_CELL)
jupyterKeybindings.push(EVAL_AND_SELECT_BELOW)
jupyterKeybindings.push(DELETE_CELL)
jupyterKeybindings.push(SAVE_NOTEBOOK)
jupyterKeybindings.push(EXPORT_NOTEBOOK)
jupyterKeybindings.push(SHOW_DECLARED_VARIABLES)
jupyterKeybindings.push(SHOW_HISTORY)

export default jupyterKeybindings