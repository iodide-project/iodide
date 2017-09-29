function newCellID(loadedState) {
  var newID = loadedState.cells.reduce((maxId, cell) => {
    return Math.max(cell.id, maxId)
  }, -1) + 1
  return newID
}

function cloneState(state){
  return Object.assign({}, state)
}

function newCell(loadedState, cellType){
  return {
    content:'',
    id: newCellID(loadedState),
    cellType: cellType,
    value: undefined,
    rendered: false,
    selected: false,
    executionStatus: " ",
    // evaluationOld set to true if the content of the editor changes from whatever
    // produced the most recent output value
    evaluationOld: true
  }
}

function blankState(){
  var initialState =  {
    title: undefined,
    cells: [],
    declaredProperties:{},
    lastValue: undefined,
    lastSaved: undefined,
    mode: 'command',
    sidePaneMode: undefined,
    history:[],
    externalScripts:[],
    executionNumber: 1
  }
  return initialState
}

function newNotebook(){
  var initialState = blankState()
  initialState.cells.push(newCell(initialState, 'javascript'))
  initialState.cells[0].selected = true
  return initialState
}

function getSelectedCell(cells) {
  let index = cells.slice().findIndex((c)=>{return c.selected})
  if (index > -1) {
    return cells[index]
  } else {
    return undefined // for now
  }
}

export {
  getSelectedCell, 
  blankState, 
  newNotebook, 
  newCell
}