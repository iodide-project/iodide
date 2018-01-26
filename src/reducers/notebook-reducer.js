import { newNotebook, newCell, blankState } from '../state-prototypes.js'
import {exportJsmdBundle} from '../jsmd-tools'

function clearHistory(loadedState) {
  // remove history and declared properties before exporting the state.
  loadedState.userDefinedVariables = {}
  loadedState.history = []
  loadedState.externalDependencies = []
  loadedState.executionNumber = 0
  loadedState.cells = [...loadedState.cells.slice()]
  loadedState.cells.forEach(cell=>{
    cell.evalStatus = undefined
    if (cell.cellType==='javascript' || cell.cellType ==='external dependencies') cell.value = undefined
  })
}

function clearUserDefinedVars(userDefinedVariables){
  //remove user defined variables when loading/importing a new/saved NB
  Object.keys(userDefinedVariables).forEach(varName => {
    try {
      delete window[varName]
    } catch(e) {
      console.log(e)
    }
  })
}

let notebookReducer = function (state = newNotebook(), action) {
  let nextState
  let title
  let cells

  switch (action.type) {
  case 'NEW_NOTEBOOK':
    clearUserDefinedVars(state.userDefinedVariables)
    return newNotebook()

  case 'EXPORT_NOTEBOOK': {
    nextState = Object.assign({}, state)
    clearHistory(nextState)
    let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportJsmdBundle(nextState))
    let dlAnchorElem = document.getElementById('export-anchor')
    dlAnchorElem.setAttribute('href', dataStr)
    title = nextState.title === undefined ? 'new-notebook' : nextState.title
    let filename = title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.html'
    dlAnchorElem.setAttribute('download', filename)
    dlAnchorElem.click()
      
    return Object.assign({}, state)
  }

  case 'IMPORT_NOTEBOOK': {
    // note: loading a NB should always assign to a copy of the latest global
    // and per-cell state for backwards compatibility
    nextState = action.newState
    clearUserDefinedVars(state.userDefinedVariables)
    clearHistory(nextState)
    cells = nextState.cells.map(
      cell => Object.assign(newCell(nextState.cells, cell.cellType), cell) )
    return Object.assign(blankState(), nextState, {cells})
  }

  case 'SAVE_NOTEBOOK': {
    let lastSaved
    if (!action.autosave) lastSaved = new Date()
    else lastSaved = state.lastSaved
    nextState = Object.assign({}, state, {lastSaved}, {cells: state.cells.slice().map(c=>{
      let newC = Object.assign({},c)
      newC.evalStatus = undefined
      if (newC.cellType === 'javascript' || newC.cellType === 'external dependencies') {
        newC.value = undefined
      }
      return newC
    }), }, {title: state.title === undefined ? 'new notebook' : state.title})
    clearHistory(nextState)
    if (action.title!==undefined) title = action.title
    else title = state.title
    window.localStorage.setItem(title, JSON.stringify(nextState))
    return Object.assign({}, state, {lastSaved})
  }

  case 'LOAD_NOTEBOOK': {
    // note: loading a NB should always assign to a copy of the latest global
    // and per-cell state for backwards compatibility
    clearUserDefinedVars(state.userDefinedVariables)
    nextState = JSON.parse(window.localStorage.getItem(action.title))
    clearHistory(nextState)
    cells = nextState.cells.map(
      cell => Object.assign(newCell(nextState.cells, cell.cellType), cell) )
    nextState = Object.assign(blankState(), nextState, {cells})
    return nextState
  }

  case 'DELETE_NOTEBOOK': {
    title = action.title
    if (window.localStorage.hasOwnProperty(title)) window.localStorage.removeItem(title)
    nextState = (title === state.title) ? Object.assign({}, newNotebook()) : Object.assign({}, state)
    return nextState
  }

  case 'CHANGE_PAGE_TITLE':
    return Object.assign({}, state, {title: action.title})

  case 'SET_VIEW_MODE': {
    let viewMode = action.viewMode
    return Object.assign({}, state, {viewMode})
  }

  case 'CHANGE_MODE':{
    let mode = action.mode
    if (mode == 'command') document.activeElement.blur()
    return Object.assign({}, state, {mode})
  }

  case 'CHANGE_SIDE_PANE_MODE': {
    return Object.assign({}, state, {sidePaneMode: action.mode})
  }

  default: {
    return state
  }
  }
}

export default notebookReducer