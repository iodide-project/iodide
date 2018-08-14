function moveCell(cells, cellId, dir) {
  const cellsSlice = cells.slice()
  const index = cellsSlice.findIndex(c => c.id === cellId)

  let moveIndex
  let moveCondition
  if (dir === 'up') {
    moveIndex = -1
    moveCondition = index > 0
  } else {
    moveIndex = 1
    moveCondition = index < cellsSlice.length - 1
  }
  if (moveCondition) {
    const elem = cellsSlice[index + moveIndex]
    cellsSlice[index + moveIndex] = cellsSlice[index]
    cellsSlice[index] = elem
  }
  return cellsSlice
}

function addExternalDependency(dep) {
  // FIXME there must be a better way to do this with promises etc...
  const head = document.getElementsByTagName('head')[0]
  let elem
  const outElem = {}
  // check for js: or css:
  let src
  let depType

  if (dep.trim().slice(0, 2) === '//') {
    return undefined
  }

  if (dep.slice(0, 4) === 'css:') {
    depType = 'css'
    src = dep.slice(4)
  } else if (dep.slice(0, 3) === 'js:') {
    depType = 'js'
    src = dep.slice(3)
  } else if (dep.slice(dep.length - 2) === 'js') {
    depType = 'js'
    src = dep
  } else if (dep.slice(dep.length - 3) === 'css') {
    depType = 'css'
    src = dep
  } else {
    src = dep
  }

  src = src.trim()

  if (depType === 'js') {
    elem = document.createElement('script')
    elem.type = 'text/javascript'
    const xhrObj = new XMLHttpRequest()
    xhrObj.open('GET', src, false)
    try {
      xhrObj.send('')
      elem.text = xhrObj.responseText
      outElem.status = 'loaded'
    } catch (err) {
      outElem.status = 'error'
      outElem.statusExplanation = err.message
    }
  } else if (depType === 'css') {
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

  const initialWindow = Object.keys(window)

  head.appendChild(elem)

  const newWindow = Object.keys(window)

  outElem.variables = newWindow.filter(v => !initialWindow.includes(v))

  outElem.src = src
  outElem.dependencyType = depType

  return outElem
}

function getSelectedCellId(state) {
  const { cells } = state
  const index = cells.findIndex(c => c.selected)
  if (index > -1) {
    return cells[index].id
  }
  return undefined // for now
}

function getSelectedCellIndex(state) {
  const { cells } = state
  const index = cells.findIndex(c => c.selected)
  if (index > -1) {
    return index
  }
  return undefined // for now
}

function getCellBelowSelectedId(state) {
  const { cells } = state
  const index = cells.findIndex(c => c.selected)
  if (index === cells.length - 1) {
    // if there is no cell below, return this cell's id
    return cells[index].id
  } else if (index >= 0 && index < (cells.length - 1)) {
    return cells[index + 1].id
  }
  throw new Error('no cell currently selected')
}

function getSelectedCell(state) {
  const { cells } = state
  const index = cells.findIndex(c => c.selected)
  if (index > -1) {
    return cells[index]
  }
  return undefined // for now
}

function checkForHighlightedCells(state) {
  const cells = state.cells.slice()
  return cells.find(c => c.highlighted)
}

function newStateWithPropsAssignedForHighlightedCells(state, cellPropsToSet) {
  const cells = state.cells.slice()
  cells.forEach((cell, i) => {
    if (cell.highlighted) {
      cells[i] = Object.assign({}, cell, cellPropsToSet)
    }
  })
  return Object.assign({}, state, { cells })
}

function newStateWithSelectedCellPropertySet(state, cellPropToSet, newValue) {
  const cells = state.cells.slice()
  const thisCell = getSelectedCell(state)
  thisCell[cellPropToSet] = newValue
  return Object.assign({}, state, { cells })
}

function newStateWithPropsAssignedForCell(state, cellId, cellPropsToSet) {
  const cells = state.cells.slice()
  const index = cells.findIndex(c => c.id === cellId)
  cells[index] = Object.assign({}, cells[index], cellPropsToSet)
  return Object.assign({}, state, { cells })
}

function newStateWithSelectedCellPropsAssigned(state, cellPropsToSet) {
  return newStateWithPropsAssignedForCell(state, getSelectedCellId(state), cellPropsToSet)
}

export {
  moveCell,
  addExternalDependency,
  getSelectedCell,
  getSelectedCellIndex,
  getSelectedCellId,
  getCellBelowSelectedId,
  newStateWithSelectedCellPropertySet,
  newStateWithSelectedCellPropsAssigned,
  newStateWithPropsAssignedForCell,
  checkForHighlightedCells,
  newStateWithPropsAssignedForHighlightedCells,
}
