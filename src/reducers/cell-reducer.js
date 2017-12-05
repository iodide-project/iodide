import * as NB from '../notebook-utils.js'
import tjsm from '../transpile-jsm.js'

import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
var MD = MarkdownIt({html:true})
MD.use(MarkdownItKatex)

var initialVariables = new Set(Object.keys(window)) // gives all global variables
initialVariables.add('__core-js_shared__')
initialVariables.add('Mousetrap')

var evalStatuses = {}
evalStatuses.SUCCESS = 'success'
evalStatuses.ERROR = 'error'

function addCell(cells, cellType) {}

function scrollToCellIfNeeded(cellID) {
  var elem = document.getElementById('cell-'+cellID)
  var rect = elem.getBoundingClientRect()
  var viewportRect = document.getElementById('cells').getBoundingClientRect()
  var windowHeight = (window.innerHeight || document.documentElement.clientHeight)
  var tallerThanWindow = (rect.bottom-rect.top)>windowHeight
  var cellPosition
  // verbose but readable
  if (rect.bottom <= viewportRect.top){
    cellPosition = 'ABOVE_VIEWPORT'
  } else if (rect.top>=viewportRect.bottom){
    cellPosition = 'BELOW_VIEWPORT'
  } else if ((rect.top<=viewportRect.top) && (viewportRect.top<=rect.bottom)){
    cellPosition = 'BOTTOM_IN_VIEWPORT'
  } else if ((rect.top<=viewportRect.bottom) && (viewportRect.bottom<=rect.bottom)){
    cellPosition = 'TOP_IN_VIEWPORT'
  } else {
    cellPosition = 'IN_VIEWPORT'
  }

  if ((cellPosition == 'ABOVE_VIEWPORT')
    || (cellPosition == 'BOTTOM_IN_VIEWPORT')
    || ((cellPosition == 'BELOW_VIEWPORT') && (tallerThanWindow))
    || ((cellPosition == 'TOP_IN_VIEWPORT') && (tallerThanWindow))
  ){ // in these cases, scroll the window such that the cell top is at the window top
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  } else if ( ((cellPosition == 'BELOW_VIEWPORT') && !(tallerThanWindow))
    || ((cellPosition == 'TOP_IN_VIEWPORT') && !(tallerThanWindow))
  ){ //in these cases, scroll the window such that the cell bottom is at the window bottom
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }
}

function addExternalScript(scriptUrl){
  // FIXME there must be a better way to do this with promises etc...
  var head = document.getElementsByTagName('head')[0]
  var script = document.createElement('script')
  script.type = 'text/javascript'
  //script.src = scriptUrl  
  var xhrObj = new XMLHttpRequest()
  xhrObj.open('GET', scriptUrl, false)
  xhrObj.send('')
  script.text = xhrObj.responseText
  head.appendChild(script)
}

function addExternalDependency(dep){
  // FIXME there must be a better way to do this with promises etc...
  var head = document.getElementsByTagName('head')[0]
  var elem
  var outElem = {}
  // check for js: or css:
  var src
  var depType
  
  if (dep.trim().slice(0,2) === '//') {
    return
  }

  if (dep.slice(0,4) === 'css:') {
    depType = 'css'
    src = dep.slice(4)
  } else if (dep.slice(0,3) === 'js:') {
    depType = 'js'
    src = dep.slice(3)
  } else if (dep.slice(dep.length-2) === 'js') {
    depType = 'js'
    src = dep
  } else if (dep.slice(dep.length-3) === 'css') {
    depType = 'css'
    src = dep
  } else {
    src = dep
  }

  src = src.trim()

  if (depType === 'js') {
    elem = document.createElement('script')
    elem.type = 'text/javascript'
    var xhrObj = new XMLHttpRequest()
    xhrObj.open('GET', src, false)
    try {
      xhrObj.send('')
      elem.text = xhrObj.responseText
      outElem.status = 'loaded'
    } catch(err) {
      console.log(err)
      outElem.status = 'error'
      outElem.statusExplanation = err.message
    }
  } else if (depType === 'css') {
    //<link rel="stylesheet" type="text/css" href="mystyles.css" media="screen" />
    elem = document.createElement('link')
    elem.rel = 'stylesheet'
    elem.type = 'text/css'
    elem.href = src
    outElem.status = 'loaded'
  } else {
    outElem.status = 'error'
    outElem.statusExplanation = 'unknown dependency type.'
    outElem.src = src
    outElem.dependencyType = depType
    return outElem
  }
  
  //script.src = scriptUrl  
  
  head.appendChild(elem)
  outElem.src = src
  outElem.dependencyType = depType

  return outElem
}

let cell = function (state = newNotebook(), action) {
  switch (action.type) {
  case 'RUN_ALL_CELLS':
    var nextState = Object.assign({}, state, {cells: [...state.cells]})
    var breakThis = false
    state.cells.forEach(c=>{
      if (!breakThis) {
        nextState = cell(nextState, {type: 'SELECT_CELL', id: c.id})
        nextState = Object.assign({}, cell(nextState, {type:'RENDER_CELL', id: c.id, evaluateCell: true}))
        var ind = nextState.cells.findIndex(ci=>ci.id === c.id)
        if (nextState.cells[ind].evalStatus === evalStatuses.ERROR) {
          breakThis = true
        }
      }
    })
    return nextState

  case 'INSERT_CELL':
    var cells = state.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var direction = (action.direction == 'above') ? 0:1
    var nextCell = NB.newCell(state.cells, 'javascript')
    cells.splice(index+direction, 0, nextCell)
    var nextState = Object.assign({}, state, {cells})
    return nextState

  case 'ADD_CELL':
    var newState = Object.assign({}, state)
    var cells = newState.cells.slice()
    var nextCell = NB.newCell(newState.cells, action.cellType)
    var nextState = Object.assign({}, newState, {cells: [...cells, nextCell]})
    return nextState

  case 'DESELECT_ALL':
    var cells = state.cells.slice()
    cells.forEach((c)=>{c.selected=false; return c})
    return Object.assign({}, state, {cells})

  case 'CHANGE_MODE':
    var mode = action.mode
    if (mode == 'command') document.activeElement.blur()
    return Object.assign({}, state, {mode})

  case 'SELECT_CELL':
    if (typeof action.id === 'undefined') return state

    var cells = state.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    cells.forEach((c)=>c.selected=false)
    thisCell.selected = true
    cells[index] = thisCell

    if (action.scrollToCell) { scrollToCellIfNeeded(thisCell.id) }

    var nextState = Object.assign({}, state, {cells})
    return nextState

  case 'CELL_UP':
    var nextState = Object.assign({}, state, {cells: NB.moveCell(state.cells, action.id, 'up')})
    return nextState

  case 'CELL_DOWN':
    var nextState = Object.assign({}, state, {cells: NB.moveCell(state.cells, action.id, 'down')})
    return nextState

  case 'UPDATE_CELL':
    var cells = state.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    thisCell.content = action.content
    cells[index] = thisCell
    var nextState = Object.assign({}, state, {cells})
    return nextState

  case 'CHANGE_CELL_TYPE':
    if (typeof action.id === 'undefined') return state

    var cells = state.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    thisCell.cellType = action.cellType
    thisCell.value = undefined
    thisCell.rendered = false
    if (action.cellType ==='external-dependency' && !thisCell.dependencies.length) {
      thisCell.dependencies.push(newDependency(thisCell.dependencies, 'js'))
    }
    cells[index] = thisCell
    var nextState = Object.assign({}, state, {cells})
    return nextState

  case 'SET_CELL_COLLAPSED_STATE':
    if (typeof action.id === 'undefined') return state
      
    var cells = state.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    switch (action.viewMode + ',' + action.rowType){
    case 'presentation,input':
      thisCell.collapsePresentationViewInput = action.collapsedState
      break
    case 'presentation,output':
      thisCell.collapsePresentationViewOutput = action.collapsedState
      break
    case 'editor,input':
      thisCell.collapseEditViewInput = action.collapsedState
      break
    case 'editor,output':
      thisCell.collapseEditViewOutput = action.collapsedState
      break
    }
    cells[index] = thisCell
    return Object.assign({}, state, {cells})


  case 'CLEAR_CELL_BEFORE_EVALUATION':
    if (typeof action.id === 'undefined') return state
      
    var newState = Object.assign({}, state)
    var cells = newState.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    thisCell.executionStatus = '*'
    thisCell.value = undefined
    cells[index] = thisCell
    var nextState = Object.assign({}, newState, {cells})
    return nextState

  case 'MARK_CELL_NOT_RENDERED':
    if (typeof action.id === 'undefined') return state
      
    var cells = state.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    thisCell.rendered = false
    cells[index] = thisCell
    var nextState = Object.assign({}, state, {cells})
    return nextState

  case 'RENDER_CELL':
    if (typeof action.id === 'undefined') return state
      
    var newState = Object.assign({}, state)
    var declaredProperties = newState.declaredProperties
    var cells = newState.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    var executionNumber = newState.executionNumber


    if (action.evaluateCell) {
      if (thisCell.cellType === 'javascript') {
        // add to newState.history

        newState.history.push({
          cellID: thisCell.id,
          lastRan: new Date(),
          content: thisCell.content
        })

        thisCell.value = undefined

        var output
        let code = thisCell.content
        // console.log(code.slice(0,12))
        // console.log(code.slice(0,12)=="use matrix")
        // console.log(code.slice(0,12)=='use matrix')
        if (code.slice(0,12)=='\'use matrix\'' || code.slice(0,12)=='"use matrix"'){
          console.log('---transpiling code---')
          try {
            code = tjsm.transpile(thisCell.content)
            console.log('---transpiled code---')
            console.log(code)
          } catch(e) {
            console.log('---transpilation failed---')
            var err = e.constructor('transpilation failed: ' + e.message)
            // err.lineNumber = e.lineNumber - err.lineNumber + 3;
            // output = `${e.name}: ${e.message} (line ${e.lineNumber} column ${e.columnNumber})`
          }
        }

        try {
          output = window.eval(code)
          thisCell.evalStatus = evalStatuses.SUCCESS
        } catch(e) {
          var err = e.constructor('Error in Evaled Script: ' + e.message)
          err.lineNumber = e.lineNumber - err.lineNumber + 3
          output = `${e.name}: ${e.message} (line ${e.lineNumber} column ${e.columnNumber})`
          thisCell.evalStatus = evalStatuses.ERROR
        }


        thisCell.rendered = true

        if (output !== undefined) {
          thisCell.value = output
        }

        // ok. Now let's see if there are any new declared variables.
        declaredProperties = {} //
        var currentGlobal = Object.keys(window)
        currentGlobal.forEach((g)=>{
          if (!initialVariables.has(g)) {
            declaredProperties[g] = window[g]
          }
        })

        var lastValue
        newState.executionNumber++
        thisCell.executionStatus = ''+newState.executionNumber
      } else if (thisCell.cellType === 'markdown') {
        // one line, huh.
        thisCell.value = MD.render(thisCell.content)
        thisCell.rendered = true
        thisCell.evalStatus = evalStatuses.SUCCESS
      } else if (thisCell.cellType === 'external scripts') {
        var scriptUrls = thisCell.content.split('\n').filter(s => s!='')
        var newScripts = scriptUrls.filter(script => !newState.externalScripts.includes(script))
        newScripts.forEach(addExternalScript)
        newState.externalScripts.push(...newScripts)
        thisCell.value = 'loaded scripts'
        thisCell.rendered = true
        // add to newState.history
        newState.history.push({
          cellID: thisCell.id,
          lastRan: new Date(),
          content: '// added external scripts:\n' + ( newScripts.map(s => '// '+s).join('\n') )
        })
          
        newState.executionNumber++
        thisCell.executionStatus = ''+newState.executionNumber
        thisCell.evalStatus = evalStatuses.SUCCESS
        
      } else if (thisCell.cellType === 'external dependencies') {
        //var dependencies = thisCell.dependencies.filter(s => s.src!==undefined);


        //var dependencies = dependencies.filter(script => !newState.externalScripts.includes(script.src));
        var dependencies = thisCell.content.split('\n').filter(d=>d.trim().slice(0,2) !=='//')
        var outValue = dependencies.map(addExternalDependency)

        outValue.forEach(d=>{
          if (!newState.externalScripts.includes(d.src)) {
            newState.externalScripts.push(d.src)
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
            content: '// added external scripts:\n' + ( outValue.map(s => '// '+s.src).join('\n') )
          })  
        }
        //

        newState.executionNumber++
        thisCell.executionStatus = ''+newState.executionNumber
      } else {
        thisCell.rendered = false
      }
    }
    cells[index] = thisCell
    var nextState = Object.assign({}, newState, {cells}, {declaredProperties})
    return nextState

  case 'DELETE_CELL':
    if (typeof action.id === 'undefined'){
      return state
    }
    var cells = state.cells.slice()
    if (!cells.length) return state
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = state.cells[index]
    if (thisCell.selected) {
      var nextIndex=0
      if (cells.length>1) {
        if (index == cells.length-1) nextIndex = cells.length-2
        else nextIndex=index+1
        cells[nextIndex].selected=true
      }
    }

    var nextState = Object.assign({}, state, {
      cells: cells.filter((cell)=> {return cell.id !== action.id})
    })
    return nextState

  case 'CHANGE_ELEMENT_TYPE':
    if (typeof action.id === 'undefined') return state
      
    var cells = state.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    thisCell.elementType = action.elementType
    cells[index] = thisCell
    return Object.assign({}, state, {cells})

  case 'CHANGE_DOM_ELEMENT_ID':
    if (typeof action.id === 'undefined') return state
      
    var cells = state.cells.slice()
    var index = cells.findIndex(c=>c.id===action.id)
    var thisCell = cells[index]
    thisCell.domElementID = action.elemID
    cells[index] = thisCell
    return Object.assign({}, state, {cells})

  default:
    return state
  }
}

export default cell