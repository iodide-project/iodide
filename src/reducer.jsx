
import Interpreter from 'js-interpreter'
import marked from 'marked'

var INTERPRETER = new Interpreter('')
INTERPRETER.defaultProperties = Object.keys(INTERPRETER.global.properties)
INTERPRETER.declaredProperties = ()=>{ 
	var out = {};
	var declaredProps = Object.keys(INTERPRETER.global.properties)
					.filter(x=> !new Set(INTERPRETER.defaultProperties).has(x))
	declaredProps.forEach((p)=>out[p]=INTERPRETER.global.properties[p])
	return out;
};

function getId(state) {
  return state.cells.reduce((maxId, cell) => {
    return Math.max(cell.id, maxId)
  }, -1) + 1
}




let reducer = function (state, action) {
	switch (action.type) {

		case 'CHANGE_MODE':
			var mode = action.mode
			return Object.assign({}, state, {mode});

		case 'ADD_CELL':
			var nextState = Object.assign({}, state, {
				cells: [...state.cells, {
					content: '',
					id: getId(state),
					cellType: action.cellType,
					value: undefined,
					rendered: false
				}]
			})
			return nextState

		case 'SELECT_CELL':
			var cells = state.cells.slice()
			var index = cells.findIndex(c=>c.id===action.id)
			var thisCell = cells[index]
			cells.forEach((c)=>c.selected=false)
			thisCell.selected = true
			cells[index] = thisCell
			var currentlySelected = thisCell;
			var nextState = Object.assign({}, state, {cells}, {currentlySelected})
			return nextState

		// case 'SELECT_UP':
		// 	var cells = state.cells.slice()
			
		// 	var index = cells.findIndex(c=>c.id===action.id)
		// 	var thisCell = cells[index]
		// 	cells.forEach((c)=>c.selected=false)
		// 	thisCell.selected = true
		// 	cells[index] = thisCell
		// 	var currentlySelected = thisCell;
		// 	var nextState = Object.assign({}, state, {cells}, {currentlySelected})
		// 	return nextState

		case 'CELL_UP':
			var cells = state.cells.slice();
		  	var index = cells.findIndex(c=>c.id===action.id);
		  	var nextState = state;
		  	if (index > 0) {
		  		var elem = cells[index-1];
		  		cells[index-1] = cells[index];
		  		cells[index] = elem;
		  		nextState = Object.assign({}, state, {cells});
		  	} 
		  	return nextState

		case 'CELL_DOWN':
			var cells = state.cells.slice();
		  	var index = cells.findIndex(c=>c.id===action.id);
		  	var nextState = state;
		  	if (index < cells.length-1) {
		  		var elem = cells[index+1];
		  		cells[index+1] = cells[index];
		  		cells[index] = elem;
		  		 nextState = Object.assign({}, state, {cells});
		  		
		  	} 
		  	return nextState

		case 'UPDATE_CELL':
			var cells = state.cells.slice();
			var index = cells.findIndex(c=>c.id===action.id);
			var thisCell = cells[index];
			thisCell.content = action.content;
			cells[index] = thisCell;
			var nextState = Object.assign({}, state, {cells})
			return nextState

		case 'CHANGE_CELL_TYPE':
			var cells = state.cells.slice();
			var index = cells.findIndex(c=>c.id===action.id);
			var thisCell = cells[index];
			thisCell.cellType = action.cellType;
			thisCell.value = undefined;
			thisCell.rendered = false;
			cells[index] = thisCell;
			var nextState = Object.assign({}, state, {cells})
			return nextState

		case 'RENDER_CELL':
			var declaredProperties = state.declaredProperties

			var cells = state.cells.slice()
			var index = cells.findIndex(c=>c.id===action.id)
			var thisCell = cells[index]

			if (action.render) {
				if (thisCell.cellType === 'javascript') {
					thisCell.value = undefined;
					INTERPRETER.appendCode(thisCell.content);
					INTERPRETER.run();
					thisCell.rendered = true;
					thisCell.value = INTERPRETER.value;
					var lastValue;
					// Check to see if the returned value has actually updated.
					// if it hasn't, then nothing was returned from this cell.
					if (thisCell.value == state.lastValue) {
						thisCell.value = undefined;
						lastValue = state.lastValue;
					}
					else {
						lastValue = thisCell.value;
					}
					declaredProperties = INTERPRETER.declaredProperties();
				} else if (thisCell.cellType === 'markdown') {
					// one line, huh.
					thisCell.value = marked(thisCell.content);
					thisCell.rendered = true;
				}
			} else {
				thisCell.rendered = false;
			}
			
			
			cells[index] = thisCell;
			var nextState = Object.assign({}, state, {cells}, {declaredProperties}, {lastValue});
			return nextState

		case 'DELETE_CELL':
			var nextState =Object.assign({}, state, {
				cells: state.cells.filter((cell)=> {return cell.id !== action.id})
			})
			return nextState

		default:
			return state;
	}
}

export default reducer