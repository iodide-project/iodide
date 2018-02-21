import Mousetrap from 'mousetrap'
import TASKS from './task-definitions'
// for now, let's just keep the keybindings here.

Mousetrap.prototype.stopCallback = () => false


function keyBinding(elem) {
  Object.keys(TASKS).forEach((t) => {
    const task = TASKS[t]
    if (task.hasKeybinding()) {
      console.log(task.title, task.keybindings, task.keybindingCallback.bind(elem))
      Mousetrap.bind(task.keybindings, task.keybindingCallback.bind(elem))
    }
  })
}

export default keyBinding
