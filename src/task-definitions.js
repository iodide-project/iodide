import NotebookTask from './notebook-tasks'
import { store } from './store'
import actions from './actions'
import { isCommandMode,
  viewModeIsEditor,
  getCellBelowSelectedId,
  getCellAboveSelectedId } from './notebook-utils'

const dispatcher = {}
for (const action in actions) {
  if (Object.prototype.hasOwnProperty.call(actions, action)) {
    dispatcher[action] = (...params) => (store.dispatch(actions[action](...params)))
  }
}

const oscpu = window.navigator.oscpu || window.navigator.platform
let OSName = 'Unknown OS'
if (oscpu.indexOf('Win') !== -1) OSName = 'Windows'
if (oscpu.indexOf('Mac') !== -1) OSName = 'MacOS'
if (oscpu.indexOf('X11') !== -1) OSName = 'UNIX'
if (oscpu.indexOf('Linux') !== -1) OSName = 'Linux'

function commandKey(key) {
  let ctr = 'Ctrl '
  if (OSName === 'MacOS') {
    ctr = '⌘ '
  }
  return ctr + key
}

const TASKS = {}

TASKS.EvaluateCell = new NotebookTask({
  title: 'Evaluate Cell',
  keybindings: ['mod+enter'],

  keybindingCallback() {
    dispatcher.changeMode('command')
    dispatcher.evaluateCell()
  },
})

TASKS.EvaluateAndSelectBelow = new NotebookTask({
  title: 'Evaluate and Select Below',
  keybindings: ['shift+enter'],

  keybindingCallback() {
    if (viewModeIsEditor()) {
      dispatcher.changeMode('command')
      dispatcher.evaluateCell()
      const cellBelowId = getCellBelowSelectedId()
      if (cellBelowId !== null) {
        dispatcher.selectCell(cellBelowId, true)
      } else {
      // if cellBelowId *is* null, need to add a new cell.
        dispatcher.addCell('javascript')
        dispatcher.selectCell(getCellBelowSelectedId(), true)
      }
    }
  },
})

TASKS.MoveCellUp = new NotebookTask({
  title: 'Move Cell Up',
  displayKeybinding: '\u21E7 \u2191',
  keybindings: ['shift+up'],

  callback() {
    this.props.actions.cellUp()
  },
  keybindingCallback(e) {
    if (isCommandMode()) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      dispatcher.cellUp()
    }
  },
})


TASKS.MoveCellDown = new NotebookTask({
  title: 'Move Cell Down',
  displayKeybinding: '\u21E7 \u2193',
  keybindings: ['shift+down'],

  callback() {
    this.props.actions.changeCellType('javascript')
  },
  keybindingCallback(e) {
    if (isCommandMode()) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      dispatcher.cellDown()
    }
  },
})


TASKS.SelectUp = new NotebookTask({
  title: 'Select Cell Above',
  displayKeybinding: '\u2191',
  keybindings: ['up'],

  keybindingCallback(e) {
    if (isCommandMode()) {
      // e.preventDefault blocks kbd scrolling of entire window
      if (e.preventDefault) {
        e.preventDefault()
      } else { // internet explorer
        e.returnValue = false
      }
      const cellAboveId = getCellAboveSelectedId()
      if (cellAboveId !== null) { dispatcher.selectCell(cellAboveId, true) }
    }
  },
})

TASKS.SelectDown = new NotebookTask({
  title: 'Select Cell Down',
  displayKeybinding: '\u2193',
  keybindings: ['down'],

  keybindingCallback(e) {
    if (isCommandMode()) {
      // e.preventDefault blocks kbd scrolling of entire window
      if (e.preventDefault) {
        e.preventDefault()
      } else { // internet explorer
        e.returnValue = false
      }
      const cellBelowId = getCellBelowSelectedId()
      if (cellBelowId !== null) { dispatcher.selectCell(cellBelowId, true) }
    }
  },
})


TASKS.AddCellAbove = new NotebookTask({
  title: 'Add Cell Above',
  keybindings: ['a'],
  displayKeybinding: 'a',

  callback() {
    dispatcher.insertCell('javascript', 'above')
    dispatcher.selectCell(getCellAboveSelectedId(), true)
  },
  keybindingCallback() {
    if (isCommandMode()) {
      dispatcher.insertCell('javascript', 'above')
      dispatcher.selectCell(getCellAboveSelectedId(), true)
    }
  },
})

TASKS.AddCellBelow = new NotebookTask({
  title: 'Add Cell Below',
  keybindings: ['b'],
  displayKeybinding: 'b',

  callback() {
    dispatcher.insertCell('javascript', 'below')
    dispatcher.selectCell(getCellBelowSelectedId(), true)
  },
  keybindingCallback() {
    if (isCommandMode()) {
      dispatcher.insertCell('javascript', 'below')
      dispatcher.selectCell(getCellBelowSelectedId(), true)
    }
  },
})

TASKS.DeleteCell = new NotebookTask({
  title: 'Delete Cell',
  keybindings: ['shift+del', 'shift+backspace'],
  displayKeybinding: '\u21E7 \u232b',

  callback() { dispatcher.deleteCell() },
  keybindingCallback() {
    if (isCommandMode()) dispatcher.deleteCell()
  },
})

TASKS.ChangeToJavascriptCell = new NotebookTask({
  title: 'Change to Javascript',
  keybindings: ['j'],
  displayKeybinding: 'J',

  callback() {
    dispatcher.changeCellType('javascript')
  },
  keybindingCallback() {
    if (isCommandMode()) dispatcher.changeCellType('javascript')
  },
})

TASKS.ChangeToMarkdownCell = new NotebookTask({
  title: 'Change to Markdown',
  keybindings: ['m'],
  displayKeybinding: 'M',

  callback() {
    dispatcher.changeCellType('markdown')
  },
  keybindingCallback() {
    if (isCommandMode()) dispatcher.changeCellType('markdown')
  },
})

TASKS.ChangeToExternalResourceCell = new NotebookTask({
  title: 'Change to External Resource',
  keybindings: ['e'],
  displayKeybinding: 'E',

  callback() {
    dispatcher.changeCellType('external dependencies')
  },
  keybindingCallback() {
    if (isCommandMode()) dispatcher.changeCellType('external dependencies')
  },
})

TASKS.ChangeToRawCell = new NotebookTask({
  title: 'Change to Raw',
  keybindings: ['r'],
  displayKeybinding: 'R',

  callback() {
    dispatcher.changeCellType('raw')
  },
  keybindingCallback() {
    if (isCommandMode()) dispatcher.changeCellType('raw')
  },
})

TASKS.ChangeToCSSCell = new NotebookTask({
  title: 'Change to CSS',
  keybindings: ['c'],
  displayKeybinding: 'C',

  callback() {
    dispatcher.changeCellType('css')
  },
  keybindingCallback() {
    if (isCommandMode()) dispatcher.changeCellType('css')
  },
})

TASKS.EditMode = new NotebookTask({
  title: 'Change to Edit Mode',
  keybindings: ['enter', 'return'],
  displayKeybinding: '⎋',

  keybindingCallback() {
    if (isCommandMode()) {
    // e.preventDefault blocks inserting a newline when you transition to edit mode
      if (e.preventDefault) {
        e.preventDefault()
      } else { // internet explorer
        e.returnValue = false
      }
      dispatcher.changeMode('edit')
    }
  },
})

TASKS.CommandMode = new NotebookTask({
  title: 'Change to Command Mode',
  keybindings: ['esc'],

  callback() {
    dispatcher.changeMode('command')
  },
})

TASKS.SaveNotebook = new NotebookTask({
  title: 'Save Notebook',
  keybindings: ['ctrl+s', 'meta+s'],
  displayKeybinding: commandKey('S'),

  callback() { dispatcher.saveNotebook(store.getState().title) },
  keybindingCallback(e) {
    if (e.preventDefault) {
      e.preventDefault()
    } else { e.returnValue = false }
    dispatcher.saveNotebook(store.getState().title)
  },
})

TASKS.ExportNotebook = new NotebookTask({
  title: 'Export Notebook',
  keybindings: ['ctrl+e', 'meta+e'],
  displayKeybinding: commandKey('E'),

  callback() { dispatcher.exportNotebook() },
})

TASKS.ToggleDeclaredVariablesPane = new NotebookTask({
  title: 'Toggle the Declared Variables Pane',
  keybindings: ['ctrl+d', 'meta+d'],
  displayKeybinding: commandKey('D'),

  callback() {
    if (store.getState().sidePaneMode !== 'declared variables') {
      dispatcher.changeSidePaneMode('declared variables')
    } else {
      dispatcher.changeSidePaneMode()
    }
  },
  keybindingCallback(e) {
    if (e.preventDefault) {
      e.preventDefault()
    } else { e.returnValue = false }
    if (store.getState().sidePaneMode !== 'declared variables') {
      dispatcher.changeSidePaneMode('declared variables')
    } else {
      dispatcher.changeSidePaneMode()
    }
  },
})

TASKS.ToggleHistoryPane = new NotebookTask({
  title: 'Toggle the History Pane',
  keybindings: ['ctrl+h', 'meta+h'],
  displayKeybinding: commandKey('H'),

  callback() {
    if (store.getState().sidePaneMode !== 'history') {
      dispatcher.changeSidePaneMode('history')
    } else {
      dispatcher.changeSidePaneMode()
    }
  },
  keybindingCallback(e) {
    if (e.preventDefault) {
      e.preventDefault()
    } else { e.returnValue = false }
    if (store.getState().sidePaneMode !== 'history') {
      dispatcher.changeSidePaneMode('history')
    } else {
      dispatcher.changeSidePaneMode()
    }
  },
})

export default TASKS
