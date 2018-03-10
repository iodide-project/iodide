import Mousetrap from 'mousetrap'
import tasks from './task-definitions'
// for now, let's just keep the keybindings here.

Mousetrap.prototype.stopCallback = () => false

export function registerKeyBinding(task) {
  if (task.hasKeybinding()) {
    Mousetrap.bind(task.keybindings, task.keybindingCallback)
  }
}

function keyBinding() {
  Object.keys(tasks).forEach((t) => {
    const task = tasks[t]
    registerKeyBinding(task)
  })
}

export default keyBinding
