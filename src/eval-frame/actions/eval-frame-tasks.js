import UserTask from '../../actions/user-task'
import { postKeypressToEditor, postActionToEditor } from '../port-to-editor'
import { store } from '../store'
import { evalConsoleInput } from './actions'


const tasks = {}

tasks.changeToCommandMode = new UserTask({
  title: 'Change to Command Mode',
  keybindings: ['esc'],
  preventDefaultKeybinding: true,
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.saveNotebook = new UserTask({
  title: 'Save Notebook',
  keybindings: ['ctrl+s', 'meta+s'],
  preventDefaultKeybinding: true,
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.exportNotebook = new UserTask({
  title: 'Export Notebook',
  keybindings: ['ctrl+shift+e', 'meta+shift+e'],
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.closePanes = new UserTask({
  title: 'Close the eval context info panes',
  menuTitle: 'close pane',
  keybindings: ['ctrl+d', 'meta+d'],
  preventDefaultKeybinding: true,
  callback() {
    postActionToEditor({
      type: 'CHANGE_SIDE_PANE_MODE',
      sidePaneMode: '_CLOSED',
    })
  },
})

tasks.increaseEditorWidth = new UserTask({
  title: 'Increase Editor Width',
  keybindings: ['ctrl+shift+right'],
  preventDefaultKeybinding: true,
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.decreaseEditorWidth = new UserTask({
  title: 'Decrease Editor Width',
  keybindings: ['ctrl+shift+left'],
  preventDefaultKeybinding: true,
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.toggleDeclaredVariablesPane = new UserTask({
  title: 'Toggle the Declared Variables Pane',
  menuTitle: 'Declared Variables',
  keybindings: ['ctrl+d', 'meta+d'],
  preventDefaultKeybinding: true,
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.toggleHistoryPane = new UserTask({
  title: 'Toggle the History Pane',
  menuTitle: 'History',
  keybindings: ['ctrl+h', 'meta+h'],
  preventDefaultKeybinding: true,
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.toggleAppInfoPane = new UserTask({
  title: 'Toggle the App Info Pane',
  menuTitle: 'App Info',
  keybindings: ['ctrl+i', 'meta+i'],
  preventDefaultKeybinding: true,
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.toggleEditorLink = new UserTask({
  title: 'Link Editor',
  callback() {
    postActionToEditor({
      type: 'TOGGLE_EDITOR_LINK',
    })
  },
})

// the following task operates only in the eval frame
tasks.evalConsoleInput = new UserTask({
  title: 'Evaluate code in the console input area',
  menuTitle: 'Evaluate console',
  keybindings: ['mod+enter', 'shift+enter'],
  preventDefaultKeybinding: true,
  callback() {
    store.dispatch(evalConsoleInput())
  },
})

export default tasks
