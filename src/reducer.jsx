
//import Interpreter from 'js-interpreter'

import marked from 'marked'

// var INTERPRETER = new Interpreter('')
// INTERPRETER.defaultProperties = Object.keys(INTERPRETER.global.properties)
// INTERPRETER.declaredProperties = ()=>{ 
// 	var out = {};
// 	var declaredProps = Object.keys(INTERPRETER.global.properties)
// 					.filter(x=> !new Set(INTERPRETER.defaultProperties).has(x))
// 	declaredProps.forEach((p)=>out[p]=INTERPRETER.global.properties[p])
// 	return out;
// };


function getId(state) {
  return state.cells.reduce((maxId, cell) => {
    return Math.max(cell.id, maxId)
  }, -1) + 1
}

function newCell(state, cellType){
	return {
		content:'',
		id: getId(state),
		cellType: cellType,
		value: undefined,
		rendered: false,
		selected: false
	}
}

let reducer = function (state, action) {
	switch (action.type) {

		case 'SAVE_NOTEBOOK':
			// make sure your title is valid before saving!
			localStorage.setItem(state.title, JSON.stringify(state))
			//state.lastSaved = new Date()
			return Object.assign({}, state, {lastSaved: new Date()})

		case 'LOAD_NOTEBOOK':
			var state = JSON.parse(localStorage.getItem(action.title))
			return state

		case 'CHANGE_PAGE_TITLE':
			return Object.assign({}, state, {title: action.title})

		case 'CHANGE_MODE':
			var mode = action.mode
			return Object.assign({}, state, {mode});

		case 'INSERT_CELL':
			var cells = state.cells.slice()
			var index = cells.findIndex(c=>c.id===action.id)
			var direction = 0
			if (action.direction == 'above') direction=1
			cells.splice(index+direction, 0, newCell(state, 'javascript'))
			var nextState = Object.assign({}, state, {cells})
			return nextState

		case 'ADD_CELL':
			var nextState = Object.assign({}, state, {
				cells: [...state.cells, newCell(state, action.cellType)]
			})
			return nextState

		case 'DESELECT_ALL':
			var cells = state.cells.slice()
			cells.forEach((c)=>{c.selected=false; return c})
			return Object.assign({}, state, {cells}, {currentlySelected: undefined})

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

					// JS-interpreter --- CODE RUN
					//INTERPRETER.appendCode(thisCell.content);
					//INTERPRETER.run();
					
					var output = new Function(thisCell.content)()
					thisCell.rendered = true;

					// JS-interpreter --- RETURN VALUE
					//thisCell.value = INTERPRETER.value;
					if (output !== undefined) {
						thisCell.value = output
					}

					var lastValue;
					// Check to see if the returned value has actually updated.
					// if it hasn't, then nothing was returned from this cell.
					// if (thisCell.value == state.lastValue) {
					// 	thisCell.value = undefined;
					// 	lastValue = state.lastValue;
					// }
					// else {
					// 	lastValue = thisCell.value;
					// }
					//declaredProperties = INTERPRETER.declaredProperties();
				} else if (thisCell.cellType === 'markdown') {
					// one line, huh.
					thisCell.value = marked(thisCell.content);
					thisCell.rendered = true;
				}
			} else {
				thisCell.rendered = false;
			}
			
			
			cells[index] = thisCell;
			var nextState = Object.assign({}, state, {cells}, {lastValue});
			return nextState

		case 'DELETE_CELL':
			var cells = state.cells.slice()
			if (!cells.length) return state
			var index = cells.findIndex(c=>c.id===action.id)
			var thisCell = state.cells[index]
			var currentlySelected
			if (thisCell.selected) {
				var nextIndex=0;
				if (cells.length>1) {
					if (index == cells.length-1) nextIndex = cells.length-2
					else nextIndex=index+1
					cells[nextIndex].selected=true
				}
				// add the currentlySelected cell to the new spot.
				currentlySelected = cells[nextIndex]
			} else {
				currentlySelected = state.currentlySelected
			}

			var nextState = Object.assign({}, state, {
				cells: state.cells.filter((cell)=> {return cell.id !== action.id})
			}, {currentlySelected})
			return nextState

		default:
			return state
	}
}

export default reducer