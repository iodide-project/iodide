import UserTask from './user-task'
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

const tasks = {}

tasks.evaluateCell = new UserTask({
  title: 'Evaluate Cell',
  keybindings: ['mod+enter'],

  callback() {
    dispatcher.changeMode('command')
    dispatcher.evaluateCell()
  },
})

tasks.evaluateCellAndSelectBelow = new UserTask({
  title: 'Evaluate Cell and Select Below',
  keybindings: ['shift+enter'],
  keybindingPrecondition: viewModeIsEditor,
  callback() {
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
  },
})

tasks.moveCellUp = new UserTask({
  title: 'Move Cell Up',
  displayKeybinding: '\u21E7 \u2191',
  keybindings: ['shift+up'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.cellUp()
  },
})


tasks.moveCellDown = new UserTask({
  title: 'Move Cell Down',
  displayKeybinding: '\u21E7 \u2193',
  keybindings: ['shift+down'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() { dispatcher.cellDown() },
})


tasks.selectUp = new UserTask({
  title: 'Select Cell Above',
  displayKeybinding: '\u2191',
  keybindings: ['up'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    const cellAboveId = getCellAboveSelectedId()
    if (cellAboveId !== null) { dispatcher.selectCell(cellAboveId, true) }
  },
})

tasks.selectDown = new UserTask({
  title: 'Select Cell Down',
  displayKeybinding: '\u2193',
  keybindings: ['down'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) { dispatcher.selectCell(cellBelowId, true) }
  },
})

tasks.addCellAbove = new UserTask({
  title: 'Add Cell Above',
  keybindings: ['a'],
  displayKeybinding: 'a',
  keybindingPrecondition: isCommandMode,
  callback() {
    dispatcher.insertCell('javascript', 'above')
    dispatcher.selectCell(getCellAboveSelectedId(), true)
  },
})

tasks.addCellBelow = new UserTask({
  title: 'Add Cell Below',
  keybindings: ['b'],
  displayKeybinding: 'b',
  keybindingPrecondition: isCommandMode,

  callback() {
    dispatcher.insertCell('javascript', 'below')
    dispatcher.selectCell(getCellBelowSelectedId(), true)
  },
})

tasks.deleteCell = new UserTask({
  title: 'Delete Cell',
  keybindings: ['shift+del', 'shift+backspace'],
  displayKeybinding: '\u21E7 \u232b',
  keybindingPrecondition: isCommandMode,
  callback() { dispatcher.deleteCell() },
})

tasks.changeToJavascriptCell = new UserTask({
  title: 'Change to Javascript',
  keybindings: ['j'],
  displayKeybinding: 'J',
  keybindingPrecondition: isCommandMode,
  callback() {
    dispatcher.changeCellType('javascript')
  },
})

tasks.changeToMarkdownCell = new UserTask({
  title: 'Change to Markdown',
  keybindings: ['m'],
  displayKeybinding: 'M',
  keybindingPrecondition: isCommandMode,
  callback() {
    dispatcher.changeCellType('markdown')
  },
})

tasks.changeToExternalResourceCell = new UserTask({
  title: 'Change to External Resource',
  keybindings: ['e'],
  displayKeybinding: 'E',
  keybindingPrecondition: isCommandMode,
  callback() {
    dispatcher.changeCellType('external dependencies')
  },
})

tasks.changeToRawCell = new UserTask({
  title: 'Change to Raw',
  keybindings: ['r'],
  displayKeybinding: 'R',
  keybindingPrecondition: isCommandMode,
  callback() { dispatcher.changeCellType('raw') },
})

tasks.changeToCSSCell = new UserTask({
  title: 'Change to CSS',
  keybindings: ['c'],
  displayKeybinding: 'C',
  keybindingPrecondition: isCommandMode,
  callback() { dispatcher.changeCellType('css') },

})

tasks.changeToEditMode = new UserTask({
  title: 'Change to Edit Mode',
  keybindings: ['enter', 'return'],
  displayKeybinding: 'enter',
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() { dispatcher.changeMode('edit') },
})

tasks.changeToCommandMode = new UserTask({
  title: 'Change to Command Mode',
  keybindings: ['esc'],
  preventDefaultKeybinding: true,
  callback() { dispatcher.changeMode('command') },
})

tasks.saveNotebook = new UserTask({
  title: 'Save Notebook',
  keybindings: ['ctrl+s', 'meta+s'],
  displayKeybinding: commandKey('S'),
  preventDefaultKeybinding: true,
  callback() { dispatcher.saveNotebook(store.getState().title) },
})

tasks.exportNotebook = new UserTask({
  title: 'Export Notebook',
  keybindings: ['ctrl+e', 'meta+e'],
  displayKeybinding: commandKey('E'),
  callback() { dispatcher.exportNotebook() },
})

tasks.toggleDeclaredVariablesPane = new UserTask({
  title: 'Toggle the Declared Variables Pane',
  keybindings: ['ctrl+d', 'meta+d'],
  displayKeybinding: commandKey('D'),
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    if (store.getState().sidePaneMode !== 'declared variables') {
      dispatcher.changeSidePaneMode('declared variables')
    } else {
      dispatcher.changeSidePaneMode()
    }
  },

})

tasks.toggleHistoryPane = new UserTask({
  title: 'Toggle the History Pane',
  keybindings: ['ctrl+h', 'meta+h'],
  displayKeybinding: commandKey('H'),
  preventDefaultKeybinding: true,

  callback() {
    if (store.getState().sidePaneMode !== 'history') {
      dispatcher.changeSidePaneMode('history')
    } else {
      dispatcher.changeSidePaneMode()
    }
  },
})

export default tasks
