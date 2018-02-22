import NotebookTask from './notebook-task'
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

function preventDefault(e) {
  if (e.preventDefault) {
    e.preventDefault()
  } else {
    e.returnValue = false
  }
}
const tasks = {}

tasks.evaluateCell = new NotebookTask({
  title: 'Evaluate Cell',
  keybindings: ['mod+enter'],

  callback() {
    dispatcher.changeMode('command')
    dispatcher.evaluateCell()
  },
})

tasks.evaluateCellAndSelectBelow = new NotebookTask({
  title: 'Evaluate Cell and Select Below',
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

tasks.moveCellUp = new NotebookTask({
  title: 'Move Cell Up',
  displayKeybinding: '\u21E7 \u2191',
  keybindings: ['shift+up'],

  callback() {
    dispatcher.cellUp()
  },
  keybindingCallback(e) {
    if (isCommandMode()) {
      preventDefault(e)
      this.callback()
      // dispatcher.cellUp()
    }
  },
})


tasks.moveCellDown = new NotebookTask({
  title: 'Move Cell Down',
  displayKeybinding: '\u21E7 \u2193',
  keybindings: ['shift+down'],

  callback() { dispatcher.cellDown() },
  keybindingCallback(e) {
    if (isCommandMode()) {
      preventDefault(e)
      this.callback()
    }
  },
})


tasks.selectUp = new NotebookTask({
  title: 'Select Cell Above',
  displayKeybinding: '\u2191',
  keybindings: ['up'],

  callback() {
    const cellAboveId = getCellAboveSelectedId()
    if (cellAboveId !== null) { dispatcher.selectCell(cellAboveId, true) }
  },
  keybindingCallback(e) {
    if (isCommandMode()) {
      preventDefault(e)
      this.callback()
    }
  },
})

tasks.selectDown = new NotebookTask({
  title: 'Select Cell Down',
  displayKeybinding: '\u2193',
  keybindings: ['down'],

  callback() {
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) { dispatcher.selectCell(cellBelowId, true) }
  },
  keybindingCallback(e) {
    if (isCommandMode()) {
      preventDefault(e)
      this.callback()
    }
  },
})

tasks.addCellAbove = new NotebookTask({
  title: 'Add Cell Above',
  keybindings: ['a'],
  displayKeybinding: 'a',
  callback() {
    dispatcher.insertCell('javascript', 'above')
    dispatcher.selectCell(getCellAboveSelectedId(), true)
  },
  keybindingCallback() {
    if (isCommandMode()) { this.callback() }
  },
})

tasks.addCellBelow = new NotebookTask({
  title: 'Add Cell Below',
  keybindings: ['b'],
  displayKeybinding: 'b',

  callback() {
    dispatcher.insertCell('javascript', 'below')
    dispatcher.selectCell(getCellBelowSelectedId(), true)
  },
  keybindingCallback() {
    if (isCommandMode()) { this.callback() }
  },
})

tasks.deleteCell = new NotebookTask({
  title: 'Delete Cell',
  keybindings: ['shift+del', 'shift+backspace'],
  displayKeybinding: '\u21E7 \u232b',

  callback() { dispatcher.deleteCell() },
  keybindingCallback() {
    if (isCommandMode()) { this.callback() }
  },
})

tasks.changeToJavascriptCell = new NotebookTask({
  title: 'Change to Javascript',
  keybindings: ['j'],
  displayKeybinding: 'J',

  callback() {
    dispatcher.changeCellType('javascript')
  },
  keybindingCallback() {
    if (isCommandMode()) { this.callback() }
  },
})

tasks.changeToMarkdownCell = new NotebookTask({
  title: 'Change to Markdown',
  keybindings: ['m'],
  displayKeybinding: 'M',

  callback() {
    dispatcher.changeCellType('markdown')
  },
  keybindingCallback() {
    if (isCommandMode()) { this.callback() }
  },
})

tasks.changeToExternalResourceCell = new NotebookTask({
  title: 'Change to External Resource',
  keybindings: ['e'],
  displayKeybinding: 'E',

  callback() {
    dispatcher.changeCellType('external dependencies')
  },
  keybindingCallback() {
    if (isCommandMode()) { this.callback() }
  },
})

tasks.changeToRawCell = new NotebookTask({
  title: 'Change to Raw',
  keybindings: ['r'],
  displayKeybinding: 'R',

  callback() {
    dispatcher.changeCellType('raw')
  },
  keybindingCallback() {
    if (isCommandMode()) { this.callback() }
  },
})

tasks.changeToCSSCell = new NotebookTask({
  title: 'Change to CSS',
  keybindings: ['c'],
  displayKeybinding: 'C',

  callback() { dispatcher.changeCellType('css') },
  keybindingCallback() {
    if (isCommandMode()) { this.callback() }
  },
})

tasks.changeToEditMode = new NotebookTask({
  title: 'Change to Edit Mode',
  keybindings: ['enter', 'return'],
  displayKeybinding: 'enter',

  callback() { dispatcher.changeMode('edit') },

  keybindingCallback(e) {
    if (isCommandMode()) {
      preventDefault(e)
      this.callback()
    }
  },
})

tasks.changeToCommandMode = new NotebookTask({
  title: 'Change to Command Mode',
  keybindings: ['esc'],

  callback() { dispatcher.changeMode('command') },
})

tasks.saveNotebook = new NotebookTask({
  title: 'Save Notebook',
  keybindings: ['ctrl+s', 'meta+s'],
  displayKeybinding: commandKey('S'),

  callback() { dispatcher.saveNotebook(store.getState().title) },
  keybindingCallback(e) {
    preventDefault(e)
    this.callback()
  },
})

tasks.exportNotebook = new NotebookTask({
  title: 'Export Notebook',
  keybindings: ['ctrl+e', 'meta+e'],
  displayKeybinding: commandKey('E'),

  callback() { dispatcher.exportNotebook() },
})

tasks.toggleDeclaredVariablesPane = new NotebookTask({
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
    preventDefault(e)
    this.callback()
  },
})

tasks.toggleHistoryPane = new NotebookTask({
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
    preventDefault(e)
    this.callback()
  },
})

export default tasks
