function moveCell(cells, cellID, dir) {
  const cellsSlice = cells.slice()
  const index = cellsSlice.findIndex(c => c.id === cellID)

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

function scrollToCellIfNeeded(cellID) {
  const elem = document.getElementById(`cell-${cellID}`)
  const rect = elem.getBoundingClientRect()
  const viewportRect = document.getElementById('cells').getBoundingClientRect()
  const windowHeight = (window.innerHeight || document.documentElement.clientHeight)
  const tallerThanWindow = (rect.bottom - rect.top) > windowHeight
  let cellPosition
  // verbose but readable
  if (rect.bottom <= viewportRect.top) {
    cellPosition = 'ABOVE_VIEWPORT'
  } else if (rect.top >= viewportRect.bottom) {
    cellPosition = 'BELOW_VIEWPORT'
  } else if ((rect.top <= viewportRect.top) && (viewportRect.top <= rect.bottom)) {
    cellPosition = 'BOTTOM_IN_VIEWPORT'
  } else if ((rect.top <= viewportRect.bottom) && (viewportRect.bottom <= rect.bottom)) {
    cellPosition = 'TOP_IN_VIEWPORT'
  } else {
    cellPosition = 'IN_VIEWPORT'
  }

  if ((cellPosition === 'ABOVE_VIEWPORT')
    || (cellPosition === 'BOTTOM_IN_VIEWPORT')
    || ((cellPosition === 'BELOW_VIEWPORT') && (tallerThanWindow))
    || ((cellPosition === 'TOP_IN_VIEWPORT') && (tallerThanWindow))
  ) { // in these cases, scroll the window such that the cell top is at the window top
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  } else if (((cellPosition === 'BELOW_VIEWPORT') && !(tallerThanWindow))
    || ((cellPosition === 'TOP_IN_VIEWPORT') && !(tallerThanWindow))
  ) { // in these cases, scroll the window such that the cell bottom is at the window bottom
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }
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

function newStateWithSelectedCellPropertySet(state, cellPropToSet, newValue) {
  const cells = state.cells.slice()
  const thisCell = getSelectedCell(state)
  thisCell[cellPropToSet] = newValue
  return Object.assign({}, state, { cells })
}

function newStateWithSelectedCellPropsAssigned(state, cellPropsToSet) {
  const cells = state.cells.slice()
  const index = cells.findIndex(c => c.selected)
  cells[index] = Object.assign(cells[index], cellPropsToSet)
  return Object.assign({}, state, { cells })
}

export {
  moveCell,
  scrollToCellIfNeeded,
  addExternalDependency,
  getSelectedCellId,
  getCellBelowSelectedId,
  newStateWithSelectedCellPropertySet,
  newStateWithSelectedCellPropsAssigned,
}
