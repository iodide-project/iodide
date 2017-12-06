function newCellID(cells) {
  let newID = cells.reduce( (maxId, cell) => {
    return Math.max(cell.id, maxId)
  }, -1) + 1
  return newID
}

function newCell(cells, cellType){
  let outputCollapseDefault
  if (cellType=='dom' || cellType=='external scripts' || cellType=='dom'){
    outputCollapseDefault = 'COLLAPSED'
  } else {outputCollapseDefault = 'EXPANDED'}
  return {
    content:'',
    id: newCellID(cells),
    cellType: cellType,
    value: undefined,
    rendered: false,
    selected: false,
    executionStatus: ' ',
    evalStatus: undefined,
    // dependencies: [newDependency([], 'js')],
    // evaluationOld set to true if the content of the editor changes from whatever
    // produced the most recent output value
    evaluationOld: true,
    // these track the collapsed state of input and outputs
    // must be one of "COLLAPSED" "SCROLLABLE" "EXPANDED"
    collapseEditViewInput: 'EXPANDED',
    collapseEditViewOutput: outputCollapseDefault,
    collapsePresentationViewInput: 'COLLAPSED',
    collapsePresentationViewOutput: outputCollapseDefault,
  }
}

function addCell(cells, cellType='javascript') {
  // mutates state.cells.
  cells.push(newCell(cells, cellType))
}

function selectCell(cells, cellID){
  cells.forEach((c)=>c.selected=false) // unselect all cells first.
  updateCell(cells, cellID, {selected: true})
}

function updateCell(cells, cellID, options) {
  // mutates state.cells.
  if (cellID === undefined || options === undefined) {
    throw new ValueError('updateCell requires a cellID and options. You provided id:' + cellID +' and options:' + options)
  } else {
    let thisCellIndex = cells.findIndex((c)=> c.id == cellID)
    let cell = cells[thisCellIndex]
    Object.keys(options).forEach((k)=>{
      cell[k] = options[k]
    })
  }
}

function blankState(){
  let initialState =  {
    title: undefined,
    cells: [],
    declaredProperties:{},
    lastValue: undefined,
    lastSaved: undefined,
    mode: 'command', // command, edit
    viewMode: 'editor', // editor, presentation
    sidePaneMode: undefined,
    history:[],
    externalScripts:[],
    executionNumber: 1
  }
  return initialState
}

function newNotebook(){
  let initialState = blankState()
  //initialState.cells.push(newCell(initialState.cells, 'javascript'))
  addCell(initialState.cells, 'javascript')
  selectCell(initialState.cells, initialState.cells[0].id)
  return initialState
}


export {
  newNotebook,
  blankState,
  updateCell,
  addCell,
  newCell,
  newCellID
}