function getId(loadedState) {
  var newID = loadedState.cells.reduce((maxId, cell) => {
    return Math.max(cell.id, maxId)
  }, -1) + 1
  return newID
}

function newCell(loadedState, cellType){
  return {
    content:'',
    id: getId(loadedState),
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

function newBlankState(){
  var initialState =  {
    title: undefined,
    cells: [],
    currentlySelected: undefined,
    declaredProperties:{},
    lastValue: undefined,
    lastSaved: undefined,
    mode: 'command',
    sidePaneMode: undefined,
    history:[],
    externalScripts:[],
    executionNumber: 1
  }
  initialState.cells.push(newCell(initialState, 'javascript'))
  initialState.cells[0].selected = true
  initialState.currentlySelected = Object.assign({}, initialState.cells[0])
  return initialState
}

export {newBlankState, newCell}