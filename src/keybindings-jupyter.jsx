// import {getSelectedCell} from './notebook-utils'
import {store} from './index.jsx'
import actions from './actions.jsx'

var jupyterKeybindings = [];

// this just allows calling:
// dispatcher.action(params)
// instead of
// store.dispatch(actions.action(...params)
let dispatcher = {}
for (let action in actions){
    dispatcher[action] = (...params) => (store.dispatch(actions[action](...params)))
}


function getSelectedCellId(){
  let cells = store.getState().cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (index > -1) {
    return cells[index].id
  } else {
    return undefined // for now
  }
}

function isCommandMode(){
    return store.getState().mode=='command'
}

function isEditMode(){
    return store.getState().mode=='command'
}

function getCellBelowSelectedId(){
  let cells = store.getState().cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (0<=index && index<(cells.length-1)) {
    return cells[index+1].id
  } else {
    return undefined // for now
  }
}

function getCellAboveSelectedId(){
  let cells = store.getState().cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (0<index && index<=(cells.length-1)) {
    return cells[index-1].id
  } else {
    return undefined // for now
  }
}

var MOVE_UP = [['shift+up'], function(){
    if (isCommandMode()) dispatcher.cellUp(getSelectedCellId())
  }
]

var MOVE_DOWN = [['shift+down'], function(){
    if (isCommandMode()) dispatcher.cellDown(getSelectedCellId())
  }
]

var ADD_CELL_ABOVE = [['a'], function(){
    if (isCommandMode()) {
        dispatcher.insertCell('javascript', getSelectedCellId(), 'above')
        dispatcher.selectCell(getCellAboveSelectedId(), true)
    }
  }
]

var ADD_CELL_BELOW = [['b'], function(){
  if (isCommandMode()) {
        dispatcher.insertCell('javascript', getSelectedCellId(), 'below')
        dispatcher.selectCell(getCellBelowSelectedId(), true)
    }
  }
]

var JAVASCRIPT_MODE = [['j'], function(){
    if (isCommandMode()) dispatcher.changeCellType(getSelectedCellId(), 'javascript')
    }
]

var MARKDOWN_MODE = [['m'], function(){
    if (isCommandMode()) dispatcher.changeCellType(getSelectedCellId(), 'markdown')
    }
]

var EXTERNAL_SCRIPTS_MODE = [['e'], function(){
  if (isCommandMode()) dispatcher.changeCellType(getSelectedCellId(), 'external scripts')
  }
]

var RAW_MODE = [['r'], function(){
    if (isCommandMode()) dispatcher.changeCellType(getSelectedCellId(), 'raw')
    }
]

var SAVE_NOTEBOOK = [['ctrl+s', 'meta+s'], function(e){
  if (e.preventDefault) {
    e.preventDefault()
  } else {e.returnValue = false }
  dispatcher.saveNotebook(store.getState().title)
}]

var EXPORT_NOTEBOOK = [['ctrl+e', 'meta+e'], function(e){
  // if (e.preventDfault) e.preventDefault()
  // else e.returnValue = false
  dispatcher.exportNotebook()
}]

var SHOW_DECLARED_VARIABLES = [['ctrl+d', 'meta+d'], function(e){
  if (e.preventDefault) {
    e.preventDefault()
  } else {e.returnValue = false }
  if (store.getState().sidePaneMode !=='declared variables'){
    dispatcher.changeSidePaneMode('declared variables')
  } else {
    dispatcher.changeSidePaneMode()
  }
}]

var SHOW_HISTORY = [['ctrl+h', 'meta+h'], function(e){
  if (e.preventDefault) {
    e.preventDefault()
  } else {e.returnValue = false }
  if (store.getState().sidePaneMode !=='history'){
    dispatcher.changeSidePaneMode('history')
  } else {
    dispatcher.changeSidePaneMode()
  }
}]

var SELECT_UP = [['up'], function(e){
    if (isCommandMode()){
        // e.preventDefault blocks kbd scrolling of entire window
        if (e.preventDefault) {
            e.preventDefault();
        } else { // internet explorer
            e.returnValue = false;
        }
        dispatcher.selectCell(getCellAboveSelectedId(), true)
    }
  }
]

var SELECT_DOWN = [['down'], function(e){
    if (isCommandMode()){
            // e.preventDefault blocks kbd scrolling of entire window
        if (e.preventDefault) {
            e.preventDefault();
        } else { // internet explorer
            e.returnValue = false;
        }
      dispatcher.selectCell(getCellBelowSelectedId(), true)
    }
  }
]

var RENDER_CELL = [['mod+enter'], function(){
        dispatcher.changeMode('command')
        dispatcher.renderCell(getSelectedCellId())
}]

var RENDER_AND_SELECT_BELOW = [['shift+enter'], function(e){
    dispatcher.changeMode('command')
    dispatcher.renderCell(getSelectedCellId())
    var cellBelowId = getCellBelowSelectedId()
    if (cellBelowId){
        dispatcher.selectCell(cellBelowId, true)
    } else {
        dispatcher.addCell('javascript')
        dispatcher.selectCell(getCellBelowSelectedId(), true)
    }
}]

var COMMAND_MODE = [['esc'], function(e){
    dispatcher.changeMode('command')
}]

var EDIT_MODE = [['enter', 'return'], function(e){
    if (isCommandMode()){
        // e.preventDefault blocks inserting a newline when you transition to edit mode
        if (e.preventDefault) {
            e.preventDefault();
        } else { // internet explorer
            e.returnValue = false;
        }
        dispatcher.changeMode('edit')
    }
}]

var DELETE_CELL = [['shift+del', 'shift+backspace'], function(){
    if (isCommandMode()) dispatcher.deleteCell(getSelectedCellId())
  }
]

jupyterKeybindings.push(JAVASCRIPT_MODE)
jupyterKeybindings.push(MARKDOWN_MODE)
jupyterKeybindings.push(EXTERNAL_SCRIPTS_MODE)
jupyterKeybindings.push(RAW_MODE)
jupyterKeybindings.push(SELECT_UP)
jupyterKeybindings.push(SELECT_DOWN)
jupyterKeybindings.push(ADD_CELL_ABOVE)
jupyterKeybindings.push(ADD_CELL_BELOW)
jupyterKeybindings.push(MOVE_UP)
jupyterKeybindings.push(MOVE_DOWN)
jupyterKeybindings.push(EDIT_MODE)
jupyterKeybindings.push(COMMAND_MODE)
jupyterKeybindings.push(RENDER_CELL)
jupyterKeybindings.push(RENDER_AND_SELECT_BELOW)
jupyterKeybindings.push(DELETE_CELL)
jupyterKeybindings.push(SAVE_NOTEBOOK)
jupyterKeybindings.push(EXPORT_NOTEBOOK)
jupyterKeybindings.push(SHOW_DECLARED_VARIABLES)
jupyterKeybindings.push(SHOW_HISTORY)

export default jupyterKeybindings