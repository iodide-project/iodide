import Mousetrap from 'mousetrap'
import jupyterKeybindings from './keybindings-jupyter.jsx'
// for now, let's just keep the keybindings here.

Mousetrap.prototype.stopCallback  = function () {
     return false;
}


function keyBinding(style, elem) {
	var binding;
	if (style === 'jupyter') {
		binding = jupyterKeybindings
		
	}
	binding.forEach((binding)=>{
		Mousetrap.bind(binding[0], binding[1].bind(elem))
	})
}

export default keyBinding