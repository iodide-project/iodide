function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

// function newCellRow(collapseEditView, collapsePresentationView) {
//   // these track the collapsed state of cell row
//   // must be one of "HIDDEN", "SCROLL", "EXPAND"
//   return { collapseEditView, collapsePresentationView }
// }

// function newCellRows(cellType) {
//   switch (cellType) {
//     case 'javascript':
//       return [
//         newCellRow('EXPAND', 'HIDDEN'),
//         newCellRow('EXPAND', 'HIDDEN'),
//       ]
//     case 'markdown':
//       return [
//         newCellRow('EXPAND', 'EXPAND'),
//       ]
//     case 'external dependencies':
//       return [
//         newCellRow('EXPAND', 'HIDDEN'),
//         newCellRow('EXPAND', 'HIDDEN'),
//       ]
//     case 'css':
//       return [
//         newCellRow('EXPAND', 'HIDDEN'),
//       ]
//     case 'raw':
//       return [
//         newCellRow('EXPAND', 'HIDDEN'),
//       ]
//     default:
//       throw Error(`Unsupported cellType: ${cellType}`)
//   }
// }

function newCell(cells, cellType) {
  // let outputCollapseDefault
  // if (cellType=='dom' || cellType=='dom'){
  //   outputCollapseDefault = 'COLLAPSED'
  // } else {outputCollapseDefault = 'EXPANDED'}
  let collapseEditViewInput
  let collapseEditViewOutput
  let collapsePresentationViewInput
  let collapsePresentationViewOutput
  switch (cellType) {
    case 'javascript':
      collapseEditViewInput = 'EXPANDED'
      collapsePresentationViewInput = 'COLLAPSED'
      collapseEditViewOutput = 'EXPANDED'
      collapsePresentationViewOutput = 'COLLAPSED'
      break
    case 'markdown':
      collapseEditViewInput = 'EXPANDED'
      collapsePresentationViewInput = 'EXPANDED'
      collapseEditViewOutput = 'EXPANDED'
      collapsePresentationViewOutput = 'EXPANDED'
      break
    case 'external dependencies':
      collapseEditViewInput = 'EXPANDED'
      collapsePresentationViewInput = 'COLLAPSED'
      collapseEditViewOutput = 'EXPANDED'
      collapsePresentationViewOutput = 'COLLAPSED'
      break
    case 'css':
      collapseEditViewInput = 'EXPANDED'
      collapsePresentationViewInput = 'COLLAPSED'
      collapseEditViewOutput = undefined
      collapsePresentationViewOutput = undefined
      break
    case 'raw':
      collapseEditViewInput = 'EXPANDED'
      collapsePresentationViewInput = 'COLLAPSED'
      collapseEditViewOutput = undefined
      collapsePresentationViewOutput = undefined
      break
    default:
      throw Error(`Unsupported cellType: ${cellType}`)
  }
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
    collapseEditViewInput,
    collapseEditViewOutput,
    collapsePresentationViewInput,
    collapsePresentationViewOutput,
    // rowState: newCellRows(cellType),
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
    executionNumber: 0,
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
