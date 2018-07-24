import UserTask from './user-task'
import ExternalLinkTask from './external-link-task'
import { store } from '../store'
import * as actions from './actions'
import {
  isCommandMode,
  viewModeIsEditor,
  getCellBelowSelectedId,
  getCellAboveSelectedId, prettyDate, formatDateString,
} from '../tools/notebook-utils'
import { stateFromJsmd } from '../tools/jsmd-tools'

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

const commandKey = () => (OSName === 'MacOS' ? '⌘' : 'Ctrl')

const tasks = {}

tasks.evaluateCell = new UserTask({
  title: 'Run Cell',
  keybindings: ['mod+enter'],

  callback() {
    dispatcher.changeMode('COMMAND_MODE')
    dispatcher.saveNotebook(true)
    dispatcher.evaluateCell()
  },
})

tasks.evaluateAllCells = new UserTask({
  title: 'Run All Cells',
  menuTitle: 'Run All Cells',
  callback() {
    dispatcher.saveNotebook(true)
    dispatcher.evaluateAllCells()
  },
})

tasks.evaluateCellAndSelectBelow = new UserTask({
  title: 'Evaluate Cell and Select Below',
  keybindings: ['shift+enter'],
  keybindingPrecondition: viewModeIsEditor,
  callback() {
    dispatcher.changeMode('COMMAND_MODE')
    dispatcher.saveNotebook(true)
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
  displayKeybinding: 'Shift+Up', // '\u21E7 \u2191',
  keybindings: ['shift+up'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.cellUp()
  },
})


tasks.moveCellDown = new UserTask({
  title: 'Move Cell Down',
  displayKeybinding: 'Shift+Down', // '\u21E7 \u2193',
  keybindings: ['shift+down'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.cellDown()
  },
})

tasks.loginGithub = new UserTask({
  title: 'Login using GitHub',
  callback() { dispatcher.login() },
})

tasks.logoutGithub = new UserTask({
  title: 'Logout',
  callback() { dispatcher.logout() },
})

tasks.exportGist = new UserTask({
  title: 'Export Gist',
  callback() { dispatcher.exportGist() },
})

tasks.selectUp = new UserTask({
  title: 'Select Cell Above',
  displayKeybinding: 'Up', // \u2191',
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
  displayKeybinding: 'Down', // '\u2193',
  keybindings: ['down'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) { dispatcher.selectCell(cellBelowId, true) }
  },
})

tasks.scrollOutputPaneToCell = new UserTask({
  title: 'Scroll output pane to this cell',
  displayKeybinding: 'Right', // '\u2193',
  keybindings: ['right'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() {
    const cellBelowId = getCellBelowSelectedId()
    if (cellBelowId !== null) { dispatcher.selectCell(cellBelowId, true) }
  },
})

tasks.toggleWrapInEditors = new UserTask({
  title: 'Toggle wrapping in editors',
  displayKeybinding: 'W', // '\u2193',
  keybindings: ['w'],
  keybindingPrecondition: isCommandMode,
  preventDefaultKeybinding: true,
  callback() { dispatcher.toggleWrapInEditors() },
})

tasks.addCellAbove = new UserTask({
  title: 'Add Cell Above',
  keybindings: ['a'],
  displayKeybinding: 'A',
  keybindingPrecondition: isCommandMode,
  callback() {
    dispatcher.insertCell('code', 'above')
    dispatcher.selectCell(getCellAboveSelectedId(), true)
  },
})

tasks.addCellBelow = new UserTask({
  title: 'Add Cell Below',
  keybindings: ['b'],
  displayKeybinding: 'B',
  keybindingPrecondition: isCommandMode,

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
  callback() { dispatcher.deleteCell() },
})

tasks.changeToJavascriptCell = new UserTask({
  title: 'Change to Javascript',
  keybindings: ['j'],
  displayKeybinding: 'J',
  keybindingPrecondition: isCommandMode,
  callback() {
    dispatcher.changeCellType('code', 'js')
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

tasks.changeToPluginCell = new UserTask({
  title: 'Change to Plugin Loader',
  keybindings: ['l'],
  displayKeybinding: 'L',
  keybindingPrecondition: isCommandMode,
  callback() { dispatcher.changeCellType('plugin') },
})

tasks.toggleSkipCellInRunAll = new UserTask({
  title: 'Toggle Skipping Cell in Run All',
  keybindings: ['s'],
  displayKeybinding: 'S',
  keybindingPrecondition: isCommandMode,
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
  preventDefaultKeybinding: true,
  callback() { dispatcher.changeMode('EDIT_MODE') },
})

tasks.changeToCommandMode = new UserTask({
  title: 'Change to Command Mode',
  keybindings: ['esc'],
  preventDefaultKeybinding: true,
  callback() { dispatcher.changeMode('COMMAND_MODE') },
})

tasks.changeTitle = new UserTask({
  title: 'Change Title',
  callback(t) { dispatcher.changePageTitle(t) },
})

tasks.createNewNotebook = new UserTask({
  title: 'New Notebook',
  preventDefaultKeybinding: true,
  callback() { dispatcher.newNotebook() },
})

tasks.saveNotebook = new UserTask({
  title: 'Save Notebook',
  keybindings: ['ctrl+s', 'meta+s'],
  displayKeybinding: `${commandKey()}+S`,
  preventDefaultKeybinding: true,
  callback() { dispatcher.saveNotebook() },
})

tasks.exportNotebook = new UserTask({
  title: 'Export Notebook',
  keybindings: ['ctrl+shift+e', 'meta+shift+e'],
  displayKeybinding: `Shift+${commandKey()}+E`,
  callback() { dispatcher.exportNotebook() },
})

tasks.exportNotebookAsReport = new UserTask({
  title: 'Export Notebook as Report',
  callback() { dispatcher.exportNotebook(true, false) },
})

tasks.exportNotebookToClipboard = new UserTask({
  title: 'Export Notebook to Clipboard',
  callback() {
    dispatcher.exportNotebook(false, true)
    dispatcher.updateAppMessages({ message: 'Notebook copied to clipboard' })
  },
})

tasks.clearVariables = new UserTask({
  title: 'Clear Variables',
  preventDefaultKeybinding: true,
  callback() { dispatcher.clearVariables() },
})

tasks.changeSidePaneWidth = new UserTask({
  title: 'Change Width of Side Pane',
  callback(widthShift) { dispatcher.changeSidePaneWidth(widthShift) },
})

tasks.toggleDeclaredVariablesPane = new UserTask({
  title: 'Toggle the Declared Variables Pane',
  menuTitle: 'Declared Variables',
  keybindings: ['ctrl+d', 'meta+d'],
  displayKeybinding: `${commandKey()}+D`,
  preventDefaultKeybinding: true,
  keybindingPrecondition: isCommandMode,
  callback() {
    if (store.getState().sidePaneMode !== 'DECLARED_VARIABLES') {
      dispatcher.changeSidePaneMode('DECLARED_VARIABLES')
    } else {
      dispatcher.changeSidePaneMode()
    }
  },
})

tasks.toggleHistoryPane = new UserTask({
  title: 'Toggle the History Pane',
  menuTitle: 'History',
  keybindings: ['ctrl+h', 'meta+h'],
  displayKeybinding: `${commandKey()}+H`,
  preventDefaultKeybinding: true,
  keybindingPrecondition: isCommandMode,
  callback() {
    if (store.getState().sidePaneMode !== '_HISTORY') {
      dispatcher.changeSidePaneMode('_HISTORY')
    } else {
      dispatcher.changeSidePaneMode()
    }
  },
})

// tasks.toggleConsolePane = new UserTask({
//   title: 'Toggle the Console Pane',
//   menuTitle: 'Console',
//   callback() {
//     if (store.getState().sidePaneMode !== '_CONSOLE') {
//       dispatcher.changeSidePaneMode('_CONSOLE')
//     } else {
//       dispatcher.changeSidePaneMode()
//     }
//   },
// })

tasks.toggleAppInfoPane = new UserTask({
  title: 'Toggle the Iodide Info Pane',
  menuTitle: 'App Messages',
  keybindings: ['ctrl+i', 'meta+i'],
  displayKeybinding: `${commandKey()}+I`,
  preventDefaultKeybinding: true,
  keybindingPrecondition: isCommandMode,
  callback() {
    if (store.getState().sidePaneMode !== '_APP_INFO') {
      dispatcher.changeSidePaneMode('_APP_INFO')
    } else {
      dispatcher.changeSidePaneMode()
    }
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

tasks.toggleEditorVisibility = new UserTask({
  title: 'Toggle Editor Visibility',
  keybindings: ['1'],
  keybindingPrecondition: isCommandMode,
  callback() { dispatcher.toggleEditorVisibility() },
})

tasks.toggleEvalFrameVisibility = new UserTask({
  title: 'Toggle Eval Frame Visibility',
  keybindings: ['2'],
  keybindingPrecondition: isCommandMode,
  callback() { dispatcher.toggleEvalFrameVisibility() },
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

export function getLocalStorageNotebook(name) {
  const localStorageEntry = localStorage.getItem(name)
  if (localStorageEntry == null) return undefined
  let { lastSaved } = stateFromJsmd(localStorageEntry)
  lastSaved = (lastSaved !== undefined) ? prettyDate(formatDateString(lastSaved)) : ' '
  return new UserTask({
    title: name,
    secondaryText: lastSaved,
    callback() {
      dispatcher.loadNotebook(name)
    },
  })
}

export default tasks
