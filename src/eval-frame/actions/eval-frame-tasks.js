import UserTask from '../../actions/user-task'
import { postKeypressToEditor, postActionToEditor } from '../port-to-editor'
// import { store } from '../store'


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

// tasks.changePaneHeight = new UserTask({
//   title: 'Change Width of Side Pane',
//   callback(heightShift) {
//     store.dispatch(changePaneHeight(heightShift))
//   },
// })

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
  title: 'Set Editor Size',
  keybindings: ['ctrl+right'],
  preventDefaultKeybinding: true,
  callback() { postKeypressToEditor(this.keybindings[0]) },
})

tasks.decreaseEditorWidth = new UserTask({
  title: 'Set Editor Size',
  keybindings: ['ctrl+left'],
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

// tasks.changeReportPaneSort = new UserTask({
//   title: 'Change Report Pane Sort',
//   callback() {
//     postActionToEditor({
//       type: 'CHANGE_REPORT_PANE_SORT',
//       sortType: store.getState().reportPaneSort === 'EVAL_ORDER' ? 'CELL_ORDER' : 'EVAL_ORDER',
//     })
//   },
// })

// tasks.changeConsolePaneSort = new UserTask({
//   title: 'Change Console Pane Sort',
//   callback() {
//     postActionToEditor({
//       type: 'CHANGE_CONSOLE_PANE_SORT',
//       sortType: store.getState().consolePaneSort === 'EVAL_ORDER' ? 'CELL_ORDER' : 'EVAL_ORDER',
//     })
//   },
// })

// const nextFilter = {
//   OUTPUT_ROWS_ONLY: 'REPORT_ROWS_ONLY',
//   REPORT_ROWS_ONLY: 'SHOW_ALL_ROWS',
//   SHOW_ALL_ROWS: 'OUTPUT_ROWS_ONLY',
// }

// tasks.changeReportPaneFilter = new UserTask({
//   title: 'Change Report Pane Filter',
//   callback() {
//     postActionToEditor({
//       type: 'CHANGE_REPORT_PANE_FILTER',
//       reportPaneOutputFilter: nextFilter[store.getState().reportPaneOutputFilter],
//     })
//   },
// })

// tasks.changeConsolePaneFilter = new UserTask({
//   title: 'Change Console Pane Filter',
//   callback() {
//     postActionToEditor({
//       type: 'CHANGE_CONSOLE_PANE_FILTER',
//       consolePaneOutputFilter: nextFilter[store.getState().consolePaneOutputFilter],
//     })
//   },
// })

tasks.toggleEditorLink = new UserTask({
  title: 'Link Editor',
  callback() {
    postActionToEditor({
      type: 'TOGGLE_EDITOR_LINK',
    })
  },
})

export default tasks
