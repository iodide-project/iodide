import Mousetrap from "mousetrap";
import tasks from "./actions/eval-frame-tasks";
// for now, let's just keep the keybindings here.

Mousetrap.prototype.stopCallback = () => false;

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
