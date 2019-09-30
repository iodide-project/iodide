import Mousetrap from "mousetrap";
import tasks from "../editor/user-tasks/task-definitions";

Mousetrap.prototype.stopCallback = () => false;

let warnUser = false;

const preventBacknav = e => {
  warnUser = e.target === document.body;
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

window.onbeforeunload = () => {
  if (warnUser) {
    warnUser = false;
    return "Are you sure you want to leave?";
  }
  return undefined;
};
