
//import Interpreter from 'js-interpreter'

import marked from 'marked'

// var INTERPRETER = new Interpreter('')
// INTERPRETER.defaultProperties = Object.keys(INTERPRETER.global.properties)
// INTERPRETER.declaredProperties = ()=>{ 
//   var out = {};
//   var declaredProps = Object.keys(INTERPRETER.global.properties)
//           .filter(x=> !new Set(INTERPRETER.defaultProperties).has(x))
//   declaredProps.forEach((p)=>out[p]=INTERPRETER.global.properties[p])
//   return out;
// };

var initialState = {
  title: undefined,
  cells: [],
  currentlySelected: undefined,
  declaredProperties:{},
  lastValue: undefined,
  lastSaved: undefined,
  mode: 'command',
  history:[],
  externalScripts:[]
}



initialState.cells.push(newCell(initialState, 'javascript'))
initialState.currentlySelected = initialState.cells[0]

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

function clearHistory(state) {
  // remove history and declared properties before exporting the state.
  state.declaredProperties = {}
  state.history = []
}

function scrollToCell(cellID) {
  var elem = document.getElementById('cell-'+cellID)
  elem.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}


let reducer = function (state, action) {
  switch (action.type) {

    case 'EXPORT_NOTEBOOK':
      var outputState = Object.assign({}, state)
      clearHistory(outputState)
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(outputState))
      var dlAnchorElem = document.getElementById('export-anchor')
      dlAnchorElem.setAttribute("href", dataStr)
      var title = state.title
      var filename = state.title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.json'
      dlAnchorElem.setAttribute("download", filename)
      dlAnchorElem.click()
      return state

    case 'IMPORT_NOTEBOOK':
      // this may need to be refactored
      var newState = action.newState
      return newState

    case 'SAVE_NOTEBOOK':
      var lastSaved = new Date()
      var outputState = Object.assign({}, state, {lastSaved})
      clearHistory(outputState)
      var title
      if (action.title!==undefined) title = action.title
      else title = state.title
      localStorage.setItem(title, JSON.stringify(outputState))
      return Object.assign({}, state, {lastSaved})

    case 'LOAD_NOTEBOOK':
      var newState = JSON.parse(localStorage.getItem(action.title))
      clearHistory(newState)
      return newState

    case 'DELETE_NOTEBOOK':
      var title = action.title
      if (localStorage.hasOwnProperty(title)) localStorage.removeItem(title)
      if (title === state.title) {
        var newState = Object.assign({}, initialState)
      } else {
        var newState = Object.assign({}, state)
      }
      return newState

    case 'CHANGE_PAGE_TITLE':
      return Object.assign({}, state, {title: action.title})

    case 'CHANGE_MODE':
      var mode = action.mode
      return Object.assign({}, state, {mode});

    case 'INSERT_CELL':
      var cells = state.cells.slice()
      var index = cells.findIndex(c=>c.id===action.id)
      var direction = (action.direction == 'above') ? 0:1

      cells.forEach((cell)=>{cell.selected=false; return cell})
      var nextCell = newCell(state, 'javascript')
      nextCell.selected = true
      cells.splice(index+direction, 0, nextCell)
      var nextState = Object.assign({}, state, {cells, currentlySelected: nextCell})
      return nextState

    case 'ADD_CELL':
      var cells = state.cells.slice()
      cells.forEach((cell)=>{cell.selected = false; return cell})

      var nextCell = newCell(state, action.cellType)
      nextCell.selected = true
      var nextState = Object.assign({}, state, {
        cells: [...cells, nextCell],
        currentlySelected: nextCell
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
      scrollToCell(thisCell.id)
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

      var newState = Object.assign({}, state)
      var declaredProperties = newState.declaredProperties
      var cells = newState.cells.slice()
      var index = cells.findIndex(c=>c.id===action.id)
      var thisCell = cells[index]

      if (action.render) {
        if (thisCell.cellType === 'javascript') {
          // add to newState.history
          newState.history.push({
            cellID: thisCell.id,
            lastRan: new Date(),
            content: thisCell.content
          })

          thisCell.value = undefined;

          var output;
          try {
    	      output = window.eval(thisCell.content);
	      } catch(e) {
	        var err = e.constructor('Error in Evaled Script: ' + e.message);
	        err.lineNumber = e.lineNumber - err.lineNumber + 3;
	        output = `${e.name}: ${e.message} (line ${e.lineNumber} column ${e.columnNumber})`
	      }
	      thisCell.rendered = true;

          if (output !== undefined) {
            thisCell.value = output
          }
          var lastValue;
        } else if (thisCell.cellType === 'markdown') {
          // one line, huh.
          thisCell.value = marked(thisCell.content);
          thisCell.rendered = true;
        }
      } else {
        thisCell.rendered = false;
      }
      
      cells[index] = thisCell;
      var nextState = Object.assign({}, newState, {cells}, {lastValue});
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

export {reducer, initialState}