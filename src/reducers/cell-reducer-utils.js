function moveCell(cells, cellID, dir) {
  let _cells = cells.slice()
  let index = _cells.findIndex(c=>c.id===cellID)
  
  let moveIndex, moveCondition
  if (dir==='up') {
    moveIndex = -1
    moveCondition = index > 0
  } else {
    moveIndex = 1
    moveCondition = index < cells.length-1
  }
  if (moveCondition) {
    let elem = _cells[index+moveIndex]
    _cells[index+moveIndex] = _cells[index]
    _cells[index] = elem
  } 
  return _cells
}

function scrollToCellIfNeeded(cellID) {
  let elem = document.getElementById('cell-'+cellID)
  let rect = elem.getBoundingClientRect()
  let viewportRect = document.getElementById('cells').getBoundingClientRect()
  let windowHeight = (window.innerHeight || document.documentElement.clientHeight)
  let tallerThanWindow = (rect.bottom-rect.top)>windowHeight
  let cellPosition
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

function addExternalDependency(dep){
  // FIXME there must be a better way to do this with promises etc...
  let head = document.getElementsByTagName('head')[0]
  let elem
  let outElem = {}
  // check for js: or css:
  let src
  let depType
  
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
    let xhrObj = new XMLHttpRequest()
    xhrObj.open('GET', src, false)
    try {
      xhrObj.send('')
      elem.text = xhrObj.responseText
      outElem.status = 'loaded'
    } catch(err) {
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
  head.appendChild(elem)
  outElem.src = src
  outElem.dependencyType = depType

  return outElem
}

function getSelectedCellId(state){
  let cells = state.cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (index > -1) {
    return cells[index].id
  } else {
    return undefined // for now
  }
}

function getCellBelowSelectedId(state){
  let cells = state.cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (index===cells.length-1){
    // if there is no cell below, return this cell's id
    return cells[index].id
  } else if (0<=index && index<(cells.length-1)) {
    return cells[index+1].id
  } else {
    throw new Error('no cell currently selected')
  }
}

function getSelectedCell(state){
  let cells = state.cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (index > -1) {
    return cells[index]
  } else {
    return undefined // for now
  }
}

function newStateWithSelectedCellPropertySet(state,cellPropToSet,newValue){
  let cells = state.cells.slice()
  let thisCell = getSelectedCell(state)
  thisCell[cellPropToSet] = newValue
  return Object.assign({}, state, {cells})
}

function newStateWithSelectedCellPropsAssigned(state,cellPropsToSet){
  let cells = state.cells.slice()
  let index = cells.findIndex((c)=>{return c.selected})
  cells[index] = Object.assign(cells[index], cellPropsToSet)
  return Object.assign({}, state, {cells})
}

export {
  moveCell,
  scrollToCellIfNeeded,
  addExternalDependency,
  getSelectedCellId,
  getCellBelowSelectedId,
  newStateWithSelectedCellPropertySet,
  newStateWithSelectedCellPropsAssigned
}