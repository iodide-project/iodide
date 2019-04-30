import Mousetrap from "mousetrap";
import tasks from "./actions/eval-frame-tasks";
// for now, let's just keep the keybindings here.

Mousetrap.prototype.stopCallback = () => false;

// FIXME: it is not clear how to make within this iframe
// the backspace key event to pop up the beforeupload modal.
// It seems to ignore the same kind of beforeupload trigger I have in the main
// editor scope.
// so in the meantime if e.target === document.body let's just
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
