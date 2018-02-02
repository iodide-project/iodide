function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function newCell(cells, cellType) {
  // let outputCollapseDefault
  // if (cellType=='dom' || cellType=='dom'){
  //   outputCollapseDefault = 'COLLAPSED'
  // } else {outputCollapseDefault = 'EXPANDED'}
  return {
    content: '',
    id: newCellID(cells),
    cellType,
    value: undefined,
    rendered: false,
    selected: false,
    executionStatus: ' ',
    evalStatus: undefined,
    // evaluationOld set to true if the content of the editor changes from whatever
    // produced the most recent output value
    evaluationOld: true,
    // these track the collapsed state of input and outputs
    // must be one of "COLLAPSED" "SCROLLABLE" "EXPANDED"
    collapseEditViewInput: 'EXPANDED',
    collapseEditViewOutput: 'EXPANDED',
    collapsePresentationViewInput: 'COLLAPSED',
    collapsePresentationViewOutput: 'EXPANDED',
  }
}


function blankState() {
  const initialState = {
    title: undefined,
    cells: [],
    userDefinedVariables: {},
    lastValue: undefined,
    lastSaved: undefined,
    mode: 'command', // command, edit
    viewMode: 'editor', // editor, presentation
    sidePaneMode: undefined,
    history: [],
    externalDependencies: [],
    executionNumber: 1,
  }
  return initialState
}

function newNotebook() {
  // initialize a blank notebook
  const initialState = blankState()
  // push a blank new cell into  into cells
  initialState.cells.push(newCell(initialState.cells, 'javascript'))
  // set the cell that was just pushed to be the selected cell
  initialState.cells[0].selected = true
  return initialState
}


export {
  newNotebook,
  blankState,
  newCell,
}
