import Mousetrap from "mousetrap";
import tasks from "../user-tasks/task-definitions";
// for now, let's just keep the keybindings here.

Mousetrap.prototype.stopCallback = () => false;

export function initializeDefaultKeybindings() {
  Object.keys(tasks).forEach(t => {
    const task = tasks[t];
    if (task.hasKeybinding()) {
      Mousetrap.bind(task.keybindings, task.keybindingCallback);
    }
  });
}

// FIXME REMOVE DEAD FUNCTION
export function addLanguageKeybinding(keys, callback) {
  Mousetrap.bind(keys, callback);
}
