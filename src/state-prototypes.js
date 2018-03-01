// class appView extends Enum {}
// appView.initEnum(['EXPLORE', 'REPORT'])

// class appMode extends Enum {}
// appMode.initEnum(['COMMAND', 'EDIT', 'TITLE', 'MENU'])

// This is a very simple enum-like class that will always return strings.
// Returning strings is required to keep things simple+serializable in the redux store.
// The only reason we wrap this in a little class it to expose the convenience
// `contains` and `values`
const StringEnum = class {
  constructor(...vals) {
    vals.forEach((v) => {
      if (v === 'values' || v === 'contains') { throw Error(`disallowed enum name: ${v}`) }
      this[v] = v
    })
    Object.freeze(this)
  }
  values() { return Object.keys(this) }
  contains(key) { return Object.keys(this).indexOf(key) >= 0 }
}

const rowOverflowEnum = new StringEnum('VISIBLE', 'SCROLL', 'HIDDEN')
// const rowTypeEnum = new StringEnum('input', 'output')
// const cellTypeEnum = new StringEnum(
// 'javascript', 'markdown', 'raw', 'css', 'external dependencies')
// const appViewEnum = new StringEnum('EXPLORE', 'REPORT') //was: 'editor', 'presentation'
// const appModeEnum = new StringEnum('COMMAND', 'EDIT', 'TITLE', 'MENU')

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

// function newCellRow(rowType, EXPLORE, REPORT) {
//   // these track the collapsed state of cell row in the two views
//   // must be one of "HIDDEN", "SCROLL", "VISIBLE"
//   return { rowType, EXPLORE, REPORT }
// }

function newCellRowSettings(cellType) {
  switch (cellType) {
    case 'javascript':
      return {
        EXPLORE: {
          input: rowOverflowEnum.VISIBLE,
          output: rowOverflowEnum.VISIBLE,
        },
        REPORT: {
          input: rowOverflowEnum.HIDDEN,
          output: rowOverflowEnum.HIDDEN,
        },
      }
    case 'markdown':
      return {
        EXPLORE: {
          input: rowOverflowEnum.VISIBLE,
          output: rowOverflowEnum.VISIBLE,
        },
        REPORT: {
          input: rowOverflowEnum.HIDDEN,
          output: rowOverflowEnum.HIDDEN,
        },
      }
    case 'external dependencies':
      return {
        EXPLORE: {
          input: rowOverflowEnum.VISIBLE,
        },
        REPORT: {
          input: rowOverflowEnum.HIDDEN,
        },
      }
    case 'css':
      return {
        EXPLORE: {
          input: rowOverflowEnum.VISIBLE,
        },
        REPORT: {
          input: rowOverflowEnum.HIDDEN,
        },
      }
    case 'raw':
      return {
        EXPLORE: {
          input: rowOverflowEnum.VISIBLE,
        },
        REPORT: {
          input: rowOverflowEnum.HIDDEN,
        },
      }
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
    rowSettings: newCellRowSettings(cellType),
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
  rowOverflowEnum,
}
