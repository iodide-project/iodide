import UserTask from './user-task'
import ExternalLinkTask from './external-link-task'
import { store } from '../store'
import * as actions from './actions'
import { getSelectedCellId } from '../reducers/cell-reducer-utils'
import {
  isCommandMode,
  viewModeIsEditor,
  getCellBelowSelectedId,
  getCellAboveSelectedId,
} from '../tools/notebook-utils'

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

const commandKey = OSName === 'MacOS' ? '⌘' : 'Ctrl'

const tasks = {}

export function addChangeLanguageTask(languageId, displayName, keybinding) {
  tasks[`changeTo${languageId}Cell`] = new UserTask({
    title: `Change to ${displayName}`,
    keybindings: [keybinding],
    displayKeybinding: keybinding,
    keybindingPrecondition: isCommandMode,
    commandModeOnlyKey: true,
    callback() {
      dispatcher.changeCellType('code', languageId)
    },
  })
}

tasks.evaluateCell = new UserTask({
  title: 'Run Cell',
  keybindings: ['mod+enter'],
  displayKeybinding: `${commandKey}+Enter`,
  callback() {
    dispatcher.evaluateText()
  },
})

tasks.evaluateAllCells = new UserTask({
  title: 'Run All Cells',
  menuTitle: 'Run All Cells',
  callback() {
    dispatcher.evaluateAllCells()
  },
})

tasks.evaluateCellAndSelectBelow = new UserTask({
  title: 'Evaluate Cell and Select Below',
  keybindings: ['shift+enter'],
  displayKeybinding: 'Shift+Enter',
  keybindingPrecondition: viewModeIsEditor,
  callback() {
    dispatcher.changeMode('COMMAND_MODE')
    dispatcher.evaluateCell()
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) {
      dispatcher.selectCell(cellBelowId, true)
    } else {
    // if cellBelowId *is* null, need to add a new cell.
      dispatcher.addCell('code')
      dispatcher.selectCell(getCellBelowSelectedId(), true)
    }
  },
})

tasks.moveCellUp = new UserTask({
  title: 'Move Cell Up',
  displayKeybinding: `${commandKey}+Up`,
  keybindings: ['ctrl+up', 'meta+up'],
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.cellUp()
  },
})


tasks.moveCellDown = new UserTask({
  title: 'Move Cell Down',
  displayKeybinding: `${commandKey}+Down`,
  keybindings: ['ctrl+down', 'meta+down'],
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.cellDown()
  },
})

tasks.highlightUp = new UserTask({
  title: 'Highlight Cell Above',
  displayKeybinding: 'Shift+Up', // '\u21E7 \u2191',
  keybindings: ['shift+up'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    const cellAboveId = getCellAboveSelectedId()
    dispatcher.highlightCell(getSelectedCellId(store.getState()), false)
    if (cellAboveId !== null) {
      dispatcher.highlightCell(cellAboveId, false)
      dispatcher.selectCell(cellAboveId, true)
    }
  },
})

tasks.highlightDown = new UserTask({
  title: 'Highlight Cell Down',
  displayKeybinding: 'Shift+Up', // '\u21E7 \u2193',
  keybindings: ['shift+down'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    const cellBelowId = getCellBelowSelectedId()
    dispatcher.highlightCell(getSelectedCellId(store.getState()), false)
    if (cellBelowId !== null) {
      dispatcher.highlightCell(cellBelowId, false)
      dispatcher.selectCell(cellBelowId, true)
    }
  },
})

tasks.loginGithub = new UserTask({
  title: 'Login using GitHub',
  callback(loginSuccess = undefined, loginFailure = undefined) {
    dispatcher.login(loginSuccess, loginFailure)
  },
})

tasks.logoutGithub = new UserTask({
  title: 'Logout',
  callback() { dispatcher.logout() },
})

tasks.selectUp = new UserTask({
  title: 'Select Cell Above',
  displayKeybinding: 'Up', // \u2191',
  keybindings: ['up'],
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  preventDefaultKeybinding: true,
  callback() {
    const cellAboveId = getCellAboveSelectedId()
    if (cellAboveId !== null) {
      dispatcher.selectCell(cellAboveId, true)
      dispatcher.unHighlightCells()
    }
  },
})

tasks.selectDown = new UserTask({
  title: 'Select Cell Down',
  displayKeybinding: 'Down', // '\u2193',
  keybindings: ['down'],
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  preventDefaultKeybinding: true,
  callback() {
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) {
      dispatcher.selectCell(cellBelowId, true)
      dispatcher.unHighlightCells()
    }
  },
})

tasks.copyCell = new UserTask({
  title: 'Copy Cell',
  keybindings: ['ctrl+c', 'command+c'],
  displayKeybinding: `${commandKey}+C`,
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() { dispatcher.cellCopy() },
})

tasks.cutCell = new UserTask({
  title: 'Cut Cell',
  keybindings: ['ctrl+x', 'command+x'],
  displayKeybinding: `${commandKey}+X`,
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() { dispatcher.cellCut() },
})

tasks.pasteCell = new UserTask({
  title: 'Paste Cell',
  keybindings: ['ctrl+v', 'command+v'],
  displayKeybinding: `${commandKey}+V`,
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() { dispatcher.cellPaste() },
})

tasks.scrollOutputPaneToCell = new UserTask({
  title: 'Scroll output pane to this cell',
  displayKeybinding: 'Right', // '\u2193',
  keybindings: ['right'],
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  preventDefaultKeybinding: true,
  callback() {
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) { dispatcher.selectCell(cellBelowId, true) }
  },
})

tasks.toggleWrapInEditors = new UserTask({
  title: 'Toggle wrapping in editors',
  displayKeybinding: 'w', // '\u2193',
  keybindings: ['alt+w'],
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  preventDefaultKeybinding: true,
  callback() { dispatcher.toggleWrapInEditors() },
})

tasks.addCellAbove = new UserTask({
  title: 'Add Cell Above',
  keybindings: ['a'],
  displayKeybinding: 'a',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() {
    dispatcher.insertCell('code', 'above')
    dispatcher.selectCell(getCellAboveSelectedId(), true)
  },
})

tasks.addCellBelow = new UserTask({
  title: 'Add Cell Below',
  keybindings: ['b'],
  displayKeybinding: 'b',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,

  callback() {
    dispatcher.insertCell('code', 'below')
    dispatcher.selectCell(getCellBelowSelectedId(), true)
  },
})

tasks.deleteCell = new UserTask({
  title: 'Delete Cell',
  keybindings: ['shift+backspace'],
  displayKeybinding: 'Shift+Backspace', // '\u21E7 \u232b',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() { dispatcher.deleteCell() },
})

tasks.changeToJavascriptCell = new UserTask({
  title: 'Change to Javascript',
  keybindings: ['j'],
  displayKeybinding: 'j',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() {
    dispatcher.changeCellType('code', 'js')
  },
})

tasks.changeToFetchCell = new UserTask({
  title: 'Change to Fetch',
  keybindings: ['f'],
  displayKeybinding: 'f',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() {
    dispatcher.changeCellType('fetch')
  },
})

tasks.changeToMarkdownCell = new UserTask({
  title: 'Change to Markdown',
  keybindings: ['m'],
  displayKeybinding: 'm',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() {
    dispatcher.changeCellType('markdown')
  },
})

tasks.changeToExternalResourceCell = new UserTask({
  title: 'Change to External Resource',
  keybindings: ['e'],
  displayKeybinding: 'e',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() {
    dispatcher.changeCellType('external dependencies')
  },
})

tasks.changeToRawCell = new UserTask({
  title: 'Change to Raw',
  keybindings: ['r'],
  displayKeybinding: 'r',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() { dispatcher.changeCellType('raw') },
})

tasks.changeToCSSCell = new UserTask({
  title: 'Change to CSS',
  keybindings: ['c'],
  displayKeybinding: 'c',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() { dispatcher.changeCellType('css') },
})

tasks.changeToPluginCell = new UserTask({
  title: 'Change to Plugin Loader',
  keybindings: ['l'],
  displayKeybinding: 'l',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() { dispatcher.changeCellType('plugin') },
})

tasks.toggleSkipCellInRunAll = new UserTask({
  title: 'Toggle Skipping Cell in Run All',
  keybindings: ['s'],
  displayKeybinding: 's',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() { dispatcher.setCellSkipInRunAll() },
})

tasks.changeMode = new UserTask({
  title: 'Change Mode',
  callback(mode) { dispatcher.changeMode(mode) },
})

tasks.changeToMenuMode = new UserTask({
  title: 'Change to Menu Mode',
  callback() { dispatcher.changeMode('APP_MODE') },
})

tasks.changeToEditMode = new UserTask({
  title: 'Change to Edit Mode',
  keybindings: ['enter', 'return'],
  displayKeybinding: 'Enter',
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  preventDefaultKeybinding: true,
  callback() { dispatcher.changeMode('EDIT_MODE') },
})

// tasks.changeToCommandMode = new UserTask({
//   title: 'Change to Command Mode',
//   keybindings: ['esc'],
//   preventDefaultKeybinding: true,
//   callback() { dispatcher.changeMode('COMMAND_MODE') },
// })

tasks.changeTitle = new UserTask({
  title: 'Change Title',
  callback(t) { dispatcher.changePageTitle(t) },
})

tasks.newNotebook = new ExternalLinkTask({
  title: 'New Notebook',
  url: '/new',
})

tasks.saveNotebook = new UserTask({
  title: 'Save Notebook',
  keybindings: ['ctrl+s', 'meta+s'],
  displayKeybinding: `${commandKey}+s`,
  preventDefaultKeybinding: true,
  callback() { dispatcher.saveNotebookToServer() },
})

tasks.exportNotebook = new UserTask({
  title: 'Export Notebook',
  keybindings: ['ctrl+shift+e', 'meta+shift+e'],
  displayKeybinding: `Shift+${commandKey}+e`,
  callback() { dispatcher.exportNotebook() },
})

tasks.exportNotebookAsReport = new UserTask({
  title: 'Export Notebook as Report',
  callback() { dispatcher.exportNotebook(true, false) },
})

tasks.clearVariables = new UserTask({
  title: 'Clear Variables',
  preventDefaultKeybinding: true,
  callback() { dispatcher.clearVariables() },
})

tasks.toggleHelpModal = new UserTask({
  title: 'Open the Help Pane',
  menuTitle: 'Help',
  keybindings: ['alt+h'],
  displayKeybinding: 'h',
  preventDefaultKeybinding: true,
  keybindingPrecondition: isCommandMode,
  commandModeOnlyKey: true,
  callback() {
    dispatcher.toggleHelpModal()
  },
})

tasks.setViewModeToEditor = new UserTask({
  title: 'Set View Mode to Editor',
  callback() {
    dispatcher.setViewMode('EXPLORE_VIEW')
  },
})

tasks.setViewModeToPresentation = new UserTask({
  title: 'Set View Mode to Presentation',
  callback() {
    dispatcher.setViewMode('REPORT_VIEW')
  },
})

tasks.fileAnIssue = new ExternalLinkTask({
  title: 'File an Issue',
  menuTitle: 'File an Issue ...',
  url: 'http://github.com/iodide-project/iodide/issues/new',
})

tasks.seeAllExamples = new ExternalLinkTask({
  title: 'See All Examples',
  menuTitle: 'See All Examples ...',
  url: 'http://github.com/iodide-project/iodide-examples/',
})

export default tasks
