import { newCell, newNotebook } from '../state-prototypes.js'

import {moveCell,scrollToCellIfNeeded,
  addExternalDependency,
  getSelectedCellId,
  getCellBelowSelectedId,
  newStateWithSelectedCellPropertySet,
  newStateWithSelectedCellPropsAssigned} from './cell-reducer-utils.js'

import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'


let MD = MarkdownIt({html:true})
MD.use(MarkdownItKatex)

let initialVariables = new Set(Object.keys(window)) // gives all global variables
initialVariables.add('__core-js_shared__')
initialVariables.add('Mousetrap')

let evalStatuses = {}
evalStatuses.SUCCESS = 'success'
evalStatuses.ERROR = 'error'



let cellReducer = function (state = newNotebook(), action) {
  let nextState
  switch (action.type) {
  case 'RUN_ALL_CELLS':{
    nextState = Object.assign({}, state, {cells: [...state.cells]})
    let breakThis = false
    state.cells.forEach(c=>{
      if (!breakThis) {
        nextState = cellReducer(nextState, {type: 'SELECT_CELL', id: c.id})
        nextState = Object.assign({}, cellReducer(nextState, {type:'EVALUATE_CELL', id: c.id, evaluateCell: true}))
        let ind = nextState.cells.findIndex(ci=>ci.id === c.id)
        if (nextState.cells[ind].evalStatus === evalStatuses.ERROR) {
          breakThis = true
        }
      }
    })
    return nextState
  }
  case 'INSERT_CELL':{
    let cells = state.cells.slice()
    let index = cells.findIndex(c=>c.id===getSelectedCellId(state))
    let direction = (action.direction == 'above') ? 0:1
    let nextCell = newCell(state.cells, 'javascript')
    cells.splice(index+direction, 0, nextCell)
    nextState = Object.assign({}, state, {cells})
    return nextState
  }
  case 'ADD_CELL':{
    nextState = Object.assign({}, state)
    let cells = nextState.cells.slice()
    let nextCell = newCell(nextState.cells, action.cellType)
    nextState = Object.assign({}, nextState, {cells: [...cells, nextCell]})
    return nextState
  }

  case 'SELECT_CELL':{
    let cells = state.cells.slice()
    cells.forEach((c)=>c.selected=false)
    let index = cells.findIndex(c=>c.id===action.id)
    let thisCell = cells[index]
    thisCell.selected = true
    if (action.scrollToCell) { scrollToCellIfNeeded(thisCell.id) }
    let nextState = Object.assign({}, state, {cells})
    return nextState
  }

  case 'CELL_UP':
    scrollToCellIfNeeded(getSelectedCellId(state))
    return Object.assign({}, state,
      {cells: moveCell(state.cells, getSelectedCellId(state), 'up')})

  case 'CELL_DOWN':
    scrollToCellIfNeeded(getCellBelowSelectedId(state))
    return Object.assign({}, state,
      {cells: moveCell(state.cells, getSelectedCellId(state), 'down')})
  
  case 'UPDATE_INPUT_CONTENT':
    return newStateWithSelectedCellPropertySet(state,'content',action.content)

  case 'CHANGE_ELEMENT_TYPE':
    return newStateWithSelectedCellPropertySet(state,'elementType',action.elementType)

  case 'CHANGE_DOM_ELEMENT_ID':
    return newStateWithSelectedCellPropertySet(state,'domElementID',action.elemID)

  case 'CHANGE_CELL_TYPE':
    return newStateWithSelectedCellPropsAssigned(state,
      {cellType:action.cellType, value:undefined, rendered:false})
    // return newStateWithSelectedCellPropertiesSet(state,
    //   ['cellType','value','rendered'],
    //   [action.cellType,undefined,false])

  case 'SET_CELL_COLLAPSED_STATE':{
    switch (action.viewMode + ',' + action.rowType){
    case 'presentation,input':
      return newStateWithSelectedCellPropertySet(state,
        'collapsePresentationViewInput',action.collapsedState)
    case 'presentation,output':
      return newStateWithSelectedCellPropertySet(state,
        'collapsePresentationViewOutput',action.collapsedState)
    case 'editor,input':
      return newStateWithSelectedCellPropertySet(state,
        'collapseEditViewInput',action.collapsedState)
    case 'editor,output':
      return newStateWithSelectedCellPropertySet(state,
        'collapseEditViewOutput',action.collapsedState)
    }
    break
  }

  case 'MARK_CELL_NOT_RENDERED':
    return newStateWithSelectedCellPropertySet(state,
      'rendered',false)

  case 'EVALUATE_CELL':{
    let newState = Object.assign({}, state)
    let userDefinedVariables = newState.userDefinedVariables
    let cells = newState.cells.slice()
    let index = cells.findIndex(c=>c.id===getSelectedCellId(state))
    let thisCell = cells[index]
    
    if (thisCell.cellType === 'javascript') {
      // add to newState.history
      newState.history.push({
        cellID: thisCell.id,
        lastRan: new Date(),
        content: thisCell.content
      })

      thisCell.value = undefined

      let output
      let code = thisCell.content
      // commenting out the transpilation code for now, but don't delete -bcolloran
      // if (code.slice(0,12)=='\'use matrix\'' || code.slice(0,12)=='"use matrix"'){
      //   try {
      //     code = tjsm.transpile(thisCell.content)
      //   } catch(e) {
      //     e.constructor('transpilation failed: ' + e.message)
      //   }
      // }

      try {
        output = window.eval(code)
        thisCell.evalStatus = evalStatuses.SUCCESS
      } catch(e) {
        let err = e.constructor('Error in Evaled Script: ' + e.message)
        err.lineNumber = e.lineNumber - err.lineNumber + 3
        output = `${e.name}: ${e.message} (line ${e.lineNumber} column ${e.columnNumber})`
        thisCell.evalStatus = evalStatuses.ERROR
      }
      thisCell.rendered = true
      if (output !== undefined) {thisCell.value = output}

      newState.executionNumber++
      thisCell.executionStatus = ''+newState.executionNumber
    } else if (thisCell.cellType === 'markdown') {
      // one line, huh.
      thisCell.value = MD.render(thisCell.content)
      thisCell.rendered = true
      thisCell.evalStatus = evalStatuses.SUCCESS
    }  else if (thisCell.cellType === 'external dependencies') {
      let dependencies = thisCell.content.split('\n').filter(d=>d.trim().slice(0,2) !=='//')
      let outValue = dependencies.map(addExternalDependency)

      outValue.forEach(d=>{
        if (!newState.externalDependencies.includes(d.src)) {
          newState.externalDependencies.push(d.src)
        }
      })
      thisCell.evalStatus = outValue.map(d=>d.status).includes('error') ? evalStatuses.ERROR : evalStatuses.SUCCESS
      thisCell.value = outValue
      thisCell.rendered = true
      // add to newState.history
      if (outValue.length) {
        newState.history.push({
          cellID: thisCell.id,
          lastRan: new Date(),
          content: '// added external dependencies:\n' + ( outValue.map(s => '// '+s.src).join('\n') )
        })  
      }
      newState.executionNumber++
      thisCell.executionStatus = ''+newState.executionNumber
    } else if (thisCell.cellType === 'css') {
      thisCell.rendered = true
      thisCell.value = thisCell.content
    } else {
      thisCell.rendered = false
    }
    
    // ok. Now let's see if there are any new declared variables or libs
    userDefinedVariables = {}
    Object.keys(window)
      .filter(g => !initialVariables.has(g))
      .forEach(g => {userDefinedVariables[g] = window[g]})
    nextState = Object.assign({}, newState, {cells}, {userDefinedVariables})
    return nextState
  }
  case 'DELETE_CELL':{
    let selectedId = getSelectedCellId(state)
    let cells = state.cells.slice()
    if (!cells.length) return state
    let index = cells.findIndex(c=>c.id===selectedId)
    let thisCell = state.cells[index]
    if (thisCell.selected) {
      let nextIndex=0
      if (cells.length>1) {
        if (index == cells.length-1) nextIndex = cells.length-2
        else nextIndex=index+1
        cells[nextIndex].selected=true
      }
    }
    nextState = Object.assign({}, state, {
      cells: cells.filter((cell)=> {return cell.id !== selectedId})
    })
    return nextState
  }


  default:
    return state
  }
}

export default cellReducer