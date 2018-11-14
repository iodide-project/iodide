import UserTask from '../../actions/user-task'
import { postKeypressToEditor, postActionToEditor } from '../port-to-editor'
import { store } from '../store'
import { evalConsoleInput } from './actions'


const tasks = {}

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
