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
    if (!(args instanceof Object && args.constructor === Object)) {
      throw new TypeError(TASK_ERRORS.argumentMustBeObject)
    }
    if (!args.keybindingCallback && !args.callback) {
      throw new TypeError(TASK_ERRORS.noCallback)
    }
    if (args.keybindingCallback && !args.keybindings) {
      throw new TypeError(TASK_ERRORS.noKeybindingsWithCallback)
    }
    if (typeof args.callback !== 'function' && args.callback !== undefined) {
      throw new TypeError(TASK_ERRORS.callbackIsNotFunction)
    }

    this.args = args

    if (!args.title) throw new TypeError(TASK_ERRORS.noTitleSupplied)
  }

  get keybindingCallback() {
    return this.args.keybindingCallback || this.args.callback
  }

  get keybindings() {
    return this.args.keybindings
  }

  hasKeybinding() {
    return this.args.keybindings !== undefined && this.args.keybindings.length !== 0
  }

  get displayKeybinding() {
    return this.args.displayKeybinding || ''
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
