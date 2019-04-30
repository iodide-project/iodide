import Mousetrap from "mousetrap";
import tasks from "./actions/eval-frame-tasks";
// for now, let's just keep the keybindings here.

Mousetrap.prototype.stopCallback = () => false;

// FIXME: it is not clear how to pop up the beforeupload browser modal
// from within the iframe only on the keypress.
// It seems to ignore the same kind of beforeupload trigger appraoch I use in the main
// editor scope. So in the meantime if e.target === document.body let's just
// prevent default here.
const preventBacknav = e => {
  if (e.target === document.body) {
    e.preventDefault();
  }
};

export function initializeDefaultKeybindings() {
  Object.keys(tasks).forEach(t => {
    const task = tasks[t];
    if (task.hasKeybinding()) {
      Mousetrap.bind(task.keybindings, task.keybindingCallback);
    }
  });
  Mousetrap.bind(["delete", "backspace"], preventBacknav);
}
