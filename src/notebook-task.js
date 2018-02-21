/*

- create notebook-task.js + tests for this // user actions?
- create task-definitions.js, which defines ALL the tasks.
- replace keybindings-jupyter with task-definitions.js
- replace menu-content.js with task-definitions.js
- create a menu-item.jsx component that wraps material-ui stuff
- menu-component / MainMenu becomes just a <menu><item/>...</menu> thing and 100% dumb all the way down.
    the only thing "smart" is the NotebookTask

*/


/* notebook-task.js */

const TASK_ERRORS = {
  noCallback: 'you must provide either a callback, a keybindingCalblack, or both (if the callbacks differ)',
  noKeybindingsWithCallback: 'keybindingCallback supplied, but no keybindings were declared',
  argumentMustBeObject: 'must provide an object as an argument',
  noTitleSupplied: 'no title supplied',
  callbackIsNotFunction: 'the callback supplied is not a function',
}

export { TASK_ERRORS }

export default class NotebookTask {
  constructor(args) {
    // keybindingCallback + keybindings (both optional)
    // displayKeybinding (optional)
    // callback (required)
    // title (required) / menuLabel (optional)
    // description (required)

    if (!(args instanceof Object && args.constructor === Object)) {
      throw new TypeError(TASK_ERRORS.argumentMustBeObject)
    }
    if (!args.keybindingCallback && !args.callback) {
      throw new TypeError(TASK_ERRORS.noCallback)
    }
    if (args.keybindingCallback && !args.keybindings) {
      throw new TypeError(TASK_ERRORS.noKeybindingsWithCallback)
    }

    if (typeof args.callback !== 'function') {
      throw new TypeError(TASK_ERRORS.callbackIsNotFunction)
    }

    // if (args.keybindingCallback) this.keybindingCallback = args.keybindingCallback
    // if (args.keybindings) this.keybindings = args.keybindings

    this.args = args

    if (!args.title) throw new TypeError(TASK_ERRORS.noTitleSupplied)
    // this.title = args.title
    // if (args.menuTitle) this.menuTitle = args.menuTitle

    // if (args.callback) this.callback = args.callback
    // if (args.displayKeybinding) this.displayKeybinding = args.displayKeybinding
  }

  get keybindingCallback() {
    return this.args.keybindingCallback || this.args.callback
  }

  get keybindings() {
    return this.args.keybindings
  }

  get displayKeybinding() {
    return this.args.displayKeybinding || ''// this.args.keybindings
  }

  get callback() {
    return this.args.callback
  }

  get title() {
    return this.args.title
  }

  get menuTitle() {
    return this.args.menuTitle || this.args.title
  }
}

/* task-definitions.js */

// const TASKS = {}

// TASKS.AddCellBelow = new NotebookTask({
//   defaultTitle: 'Add Cell Below',
//   description: 'adds a cell below the currently-selected cell',
//   keybindings: ['b'],
//   callback() {
//     dispatcher.dispatch()
//   },
// })


// TASKS.ChangeSelectedCellToJavascript = new NotebookTask({
//     title: 'Change Selected Cell To Javascript',
//     menuLabel: 'To Javascript',
//     tooltip: 'Change To Javascript',
//     description: 'adds a cell below the currently-selected cell',
//     keybindings: ['b'],
//     callback() {
//       dispatcher.dispatch()
//     },
//   })

// TASKS.AddCellBelow.title

// export default TASKS

// /* keybindings - fairly easy to handle. */

// /* some menu item */

// <Menu>
//     <MenuItem task={TASKS.AddCellBelow} />
//     <MenuItem task={TASKS.AddCellBelow} />
// </Menu>

// use NotebookTask in keybindings - just need keybindingCallback.
// use NotebookTask in menu item - need:
//     title (always default? can I override? special "menuTitle" field?)
//     callback
//     prettyKeybinding (optional)

// var t = new NotebookTask({...})
// let MenuItems = {}
// MenuItems.AddCellBelow = <MenuItem name={t.menuTitle} callback={t.callback} />

// å
// testing:

// - test getters
// - test callbacks individually
