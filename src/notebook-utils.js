function newCellID(cells) {
  var newID = cells.reduce( (maxId, cell) => {
    return Math.max(cell.id, maxId)
  }, -1) + 1
  return newID
}

function cloneState(state){
  return Object.assign({}, state)
}

function createNextState(state) {
  return cloneState(state)
}

function newCell(cells, cellType){
  return {
    content:'',
    id: newCellID(cells),
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

function addCell(cells, cellType='javascript') {
  // mutates state.cells.
  cells.push(newCell(cells, cellType))
}

function updateCell(cells, cellID, options) {
  // mutates state.cells.
  if (cellID === undefined || options === undefined) {
    throw new ValueError('updateCell requires a cellID and options. You provided id:' + cellID +' and options:' + options)
  } else {
    var cell = getCellById(cells, cellID)
    Object.keys(options).forEach((k)=>{
      cell[k] = options[k]
    })
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
  //initialState.cells.push(newCell(initialState.cells, 'javascript'))
  addCell(initialState.cells, 'javascript')
  selectCell(initialState.cells, initialState.cells[0].id)
  return initialState
}

function changeTitle(state, title) {
  state.title = title
}

function getCellById(cells, cellID) {
  // returns a reference to the cell.
  var thisCellIndex = cells.findIndex((c)=> c.id == cellID)
  var thisCell = cells[thisCellIndex]
  return thisCell
}

function selectCell(cells, cellID){
  cells.forEach((c)=>c.selected=false) // unselect all cells first.
  updateCell(cells, cellID, {selected: true})
}

function getSelectedCell(cells) {
  let index = cells.findIndex((c)=>{return c.selected})
  if (index > -1) {
    return cells[index]
  } else {
    return undefined // for now
  }
}

export {
  getSelectedCell, 
  blankState, 
  createNextState,
  changeTitle,
  newNotebook, 
  newCell,
  addCell,
  selectCell
}