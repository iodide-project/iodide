import UserTask from './user-task'
import ExternalLinkTask from './external-link-task'
import { store } from '../store'
import * as actions from './actions'

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
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.evaluateText()
    dispatcher.moveCursorToNextChunk()
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

tasks.toggleWrapInEditors = new UserTask({
  title: 'Toggle wrapping in editors',
  displayKeybinding: 'w', // '\u2193',
  keybindings: ['alt+w'],
  preventDefaultKeybinding: true,
  callback() { dispatcher.toggleWrapInEditors() },
})

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
