import { store } from './store'
import actions from './actions'
import { isCommandMode,
  viewModeIsEditor,
  getCellBelowSelectedId,
  getCellAboveSelectedId } from './notebook-utils'

const jupyterKeybindings = []

// this just allows calling:
// dispatcher.action(params)
// instead of
// store.dispatch(actions.action(...params)
const dispatcher = {}
for (const action in actions) {
  if (Object.prototype.hasOwnProperty.call(actions, action)) {
    dispatcher[action] = (...params) => (store.dispatch(actions[action](...params)))
  }
}


const MOVE_UP = [['shift+up'], (e) => {
  if (isCommandMode()) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    dispatcher.cellUp()
  }
},
]

const MOVE_DOWN = [['shift+down'], (e) => {
  if (isCommandMode()) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    dispatcher.cellDown()
  }
},
]

const ADD_CELL_ABOVE = [['a'], () => {
  if (isCommandMode()) {
    dispatcher.insertCell('javascript', 'above')
    dispatcher.selectCell(getCellAboveSelectedId(), true)
  }
},
]

const ADD_CELL_BELOW = [['b'], () => {
  if (isCommandMode()) {
    dispatcher.insertCell('javascript', 'below')
    dispatcher.selectCell(getCellBelowSelectedId(), true)
  }
},
]

const JAVASCRIPT_MODE = [['j'], () => {
  if (isCommandMode()) dispatcher.changeCellType('javascript')
},
]

const MARKDOWN_MODE = [['m'], () => {
  if (isCommandMode()) dispatcher.changeCellType('markdown')
},
]

const EXTERNAL_DEPENDENCIES_MODE = [['e'], () => {
  if (isCommandMode()) dispatcher.changeCellType('external dependencies')
},
]

const RAW_MODE = [['r'], () => {
  if (isCommandMode()) dispatcher.changeCellType('raw')
},
]

const CSS_MODE = [['c'], () => {
  if (isCommandMode()) dispatcher.changeCellType('css')
},
]

const DOM_MODE = [['d'], () => {
  if (isCommandMode()) dispatcher.changeCellType('dom')
},
]

const SAVE_NOTEBOOK = [['ctrl+s', 'meta+s'], (e) => {
  if (e.preventDefault) {
    e.preventDefault()
  } else { e.returnValue = false }
  dispatcher.saveNotebook(store.getState().title)
}]

const EXPORT_NOTEBOOK = [['ctrl+e', 'meta+e'], () => {
  // if (e.preventDfault) e.preventDefault()
  // else e.returnValue = false
  dispatcher.exportNotebook()
}]

const SHOW_DECLARED_VARIABLES = [['ctrl+d', 'meta+d'], (e) => {
  if (e.preventDefault) {
    e.preventDefault()
  } else { e.returnValue = false }
  if (store.getState().sidePaneMode !== 'declared variables') {
    dispatcher.changeSidePaneMode('declared variables')
  } else {
    dispatcher.changeSidePaneMode()
  }
}]

const SHOW_HISTORY = [['ctrl+h', 'meta+h'], (e) => {
  if (e.preventDefault) {
    e.preventDefault()
  } else { e.returnValue = false }
  if (store.getState().sidePaneMode !== 'history') {
    dispatcher.changeSidePaneMode('history')
  } else {
    dispatcher.changeSidePaneMode()
  }
}]

const SELECT_UP = [['up'], (e) => {
  if (isCommandMode()) {
    // e.preventDefault blocks kbd scrolling of entire window
    if (e.preventDefault) {
      e.preventDefault()
    } else { // internet explorer
      e.returnValue = false
    }
    const cellAboveId = getCellAboveSelectedId()
    if (cellAboveId !== null) { dispatcher.selectCell(cellAboveId, true) }
  }
},
]

const SELECT_DOWN = [['down'], (e) => {
  if (isCommandMode()) {
    // e.preventDefault blocks kbd scrolling of entire window
    if (e.preventDefault) {
      e.preventDefault()
    } else { // internet explorer
      e.returnValue = false
    }
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) { dispatcher.selectCell(cellBelowId, true) }
  }
},
]

const EVALUATE_CELL = [['mod+enter'], () => {
  dispatcher.changeMode('command')
  dispatcher.evaluateCell()
}]

const EVAL_AND_SELECT_BELOW = [['shift+enter'], () => {
  if (viewModeIsEditor()) {
    dispatcher.changeMode('command')
    dispatcher.evaluateCell()
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) {
      dispatcher.selectCell(cellBelowId, true)
    } else {
      // if cellBelowId *is* null, need to add a new cell.
      dispatcher.addCell('javascript')
      dispatcher.selectCell(getCellBelowSelectedId(), true)
    }
  }
}]

const COMMAND_MODE = [['esc'], () => {
  dispatcher.changeMode('command')
}]

const EDIT_MODE = [['enter', 'return'], (e) => {
  if (isCommandMode()) {
    // e.preventDefault blocks inserting a newline when you transition to edit mode
    if (e.preventDefault) {
      e.preventDefault()
    } else { // internet explorer
      e.returnValue = false
    }
    dispatcher.changeMode('edit')
  }
}]

const DELETE_CELL = [['shift+del', 'shift+backspace'], () => {
  if (isCommandMode()) dispatcher.deleteCell()
},
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
