import Mousetrap from 'mousetrap'
import jupyterKeybindings from './keybindings-jupyter'
// for now, let's just keep the keybindings here.

Mousetrap.prototype.stopCallback = () => false


function keyBinding(style, elem) {
  let bindings
  if (style === 'jupyter') {
    bindings = jupyterKeybindings
  }
  bindings.forEach((binding) => {
    Mousetrap.bind(binding[0], binding[1].bind(elem))
  })
}

export default keyBinding
