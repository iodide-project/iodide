import Mousetrap from "mousetrap";
import tasks from "../user-tasks/task-definitions";

Mousetrap.prototype.stopCallback = () => false;

export function initializeDefaultKeybindings() {
  Object.keys(tasks).forEach(t => {
    const task = tasks[t];
    if (task.hasKeybinding()) {
      Mousetrap.bind(task.keybindings, task.keybindingCallback);
    }
  });
}
