import UserTask from '../../actions/user-task'
import { postKeypressToEditor } from '../port-to-editor'
import { store } from '../store'
import { changePaneHeight } from './actions'

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

tasks.changePaneHeight = new UserTask({
  title: 'Change Width of Side Pane',
  callback(heightShift) {
    store.dispatch(changePaneHeight(heightShift))
  },
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

export default tasks
