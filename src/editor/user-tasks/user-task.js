const TASK_ERRORS = {
  noCallback:
    "you must provide either a callback, a keybindingCallback, or both (if the callbacks differ)",
  noKeybindingsWithCallback:
    "keybindingCallback supplied, but no keybindings were declared",
  argumentMustBeObject: "must provide an object as an argument",
  noTitleSupplied: "no title supplied",
  callbackIsNotFunction: "the callback supplied is not a function",
  keybindingsNotArray: "keybindings must be in the form of an array"
};

export { TASK_ERRORS };

export function preventDefault(e) {
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }
}

export default class UserTask {
  constructor(args) {
    if (!(args instanceof Object && args.constructor === Object)) {
      throw new TypeError(TASK_ERRORS.argumentMustBeObject);
    }
    if (!args.keybindingCallback && !args.callback) {
      throw new TypeError(TASK_ERRORS.noCallback);
    }
    if (args.keybindingCallback && !args.keybindings) {
      throw new TypeError(TASK_ERRORS.noKeybindingsWithCallback);
    }

    if (args.keybindings && !Array.isArray(args.keybindings)) {
      throw new TypeError(TASK_ERRORS.keybindingsNotArray);
    }
    if (typeof args.callback !== "function" && args.callback !== undefined) {
      throw new TypeError(TASK_ERRORS.callbackIsNotFunction);
    }
    if (!args.title) throw new TypeError(TASK_ERRORS.noTitleSupplied);

    this.args = args;
    if (this.args.callback) this.args.callback = this.args.callback.bind(this);
    if (this.args.keybindingCallback) {
      this.args.keybindingCallback = this.args.keybindingCallback.bind(this);
    }
  }

  get keybindingCallback() {
    return (
      this.args.keybindingCallback ||
      (e => {
        if ("keybindingPrecondition" in this.args) {
          if (!this.args.keybindingPrecondition()) return;
        }
        if (this.args.preventDefaultKeybinding) {
          preventDefault(e);
        }
        this.args.callback();
      })
    );
  }

  get keybindings() {
    return this.args.keybindings;
  }

  get secondaryText() {
    // primarily things that go in keybinding spot, like "last saved" info
    return this.args.secondaryText;
  }

  hasKeybinding() {
    return (
      this.args.keybindings !== undefined && this.args.keybindings.length !== 0
    );
  }

  get displayKeybinding() {
    return this.args.displayKeybinding || "";
  }

  get callback() {
    return this.args.callback;
  }

  get title() {
    return this.args.title;
  }

  get menuTitle() {
    return this.args.menuTitle || this.args.title;
  }
}
