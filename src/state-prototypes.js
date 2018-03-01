// import { Enum } from 'enumify'

// class rowOverflow extends Enum {}
// rowOverflow.initEnum({
//   VISIBLE: {
//     get nextOverflow() { return rowOverflow.SCROLL },
//     jsmdName: 'VISIBLE',
//     cssName: 'EXPANDED',
//   },
//   HIDDEN: {
//     get nextOverflow() { return rowOverflow.VISIBLE },
//     jsmdName: 'HIDDEN',
//     cssName: 'COLLAPSED',
//   },
//   SCROLL: {
//     get nextOverflow() { return rowOverflow.HIDDEN },
//     jsmdName: 'SCROLL',
//     cssName: 'SCROLLABLE',
//   },
// })
// class cellTypes extends Enum {}
// cellTypes.initEnum({
//   JS: {
//     prettyName: 'Javascript',
//     jsmdName: 'js',
//   },
//   MD: {
//     prettyName: 'Markdown',
//     jsmdName: 'md',
//   },
//   CSS: {
//     prettyName: 'CSS',
//     jsmdName: 'css',
//   },
//   RESOURCE: {
//     prettyName: 'External resource',
//     jsmdName: 'resource',
//   },
//   RAW: {
//     prettyName: 'Raw text',
//     jsmdName: 'raw',
//   },
// })

// class appView extends Enum {}
// appView.initEnum(['EXPLORE', 'REPORT'])

// class appMode extends Enum {}
// appMode.initEnum(['COMMAND', 'EDIT', 'TITLE', 'MENU'])

// This is a very simple enum-like class that will always return strings.
// Returning strings is required to keep things simple+serializable in the redux store.
// The only reason we wrap this in a little class it to expose the convenience
// `contains` and `values`
const stringEnum = class {
  constructor(vals) {
    vals.forEach(function (v) { this[v] = v })
    Object.freeze(this)
  }
  values() { return Object.keys(this) }
  contains(key) { return Object.keys(this).indexOf(key) >= 0 }
}

const rowOverflowEnum = stringEnum('VISIBLE', 'SCROLL', 'HIDDEN')
const rowTypeEnum = stringEnum('input', 'output')

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function newCellRow(rowType, REPORT, EXPORE) {
  // these track the collapsed state of cell row in the two views
  // must be one of "HIDDEN", "SCROLL", "VISIBLE"
  return { rowType, REPORT, EXPORE }
}

function newCellRows(cellType) {
  switch (cellType) {
    case 'javascript':
      return [
        newCellRow('input', rowOverflow.VISIBLE, rowOverflow.HIDDEN),
        newCellRow('output', rowOverflow.VISIBLE, rowOverflow.HIDDEN),
      ]
    case 'markdown':
      return [
        newCellRow('input', rowOverflow.VISIBLE, rowOverflow.VISIBLE),
        newCellRow('output', rowOverflow.VISIBLE, rowOverflow.VISIBLE),
      ]
    case 'external dependencies':
      return [
        newCellRow('input', rowOverflow.VISIBLE, rowOverflow.HIDDEN),
        newCellRow('output', rowOverflow.VISIBLE, rowOverflow.HIDDEN),
      ]
    case 'css':
      return [
        newCellRow('input', rowOverflow.VISIBLE, rowOverflow.HIDDEN),
      ]
    case 'raw':
      return [
        newCellRow('input', rowOverflow.VISIBLE, rowOverflow.HIDDEN),
      ]
    default:
      throw Error(`Unsupported cellType: ${cellType}`)
  }
}

function newCell(cells, cellType) {
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
    rows: newCellRows(cellType),
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
  rowOverflow,
}
