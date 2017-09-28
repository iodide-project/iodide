import { newBlankState, newCell } from './blank-state.js'

import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
var MD = MarkdownIt({html:true})
MD.use(MarkdownItKatex)

var initialVariables = new Set(Object.keys(window)) // gives all global variables
initialVariables.add('__core-js_shared__')
initialVariables.add('Mousetrap')

function scrollToCellIfNeeded(cellID) {
  var elem = document.getElementById('cell-'+cellID);
  var rect = elem.getBoundingClientRect();
  var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  var tallerThanWindow = (rect.bottom-rect.top)>windowHeight
  var cellPosition
  // verbose but readable
  if (rect.bottom <= 0){
      cellPosition = "ABOVE_VIEWPORT"
    } else if (rect.top>=windowHeight){
      cellPosition = "BELOW_VIEWPORT"
    } else if ((rect.top<=0)&&(0<=rect.bottom)){
      cellPosition = "BOTTOM_IN_VIEWPORT"
    } else if ((rect.top<=windowHeight)&&(windowHeight<=rect.bottom)){
      cellPosition = "TOP_IN_VIEWPORT"
    } else {
      cellPosition = "IN_VIEWPORT"
    };

  if ((cellPosition == "ABOVE_VIEWPORT")
    || (cellPosition == "BOTTOM_IN_VIEWPORT")
    || ((cellPosition == "BELOW_VIEWPORT") && (tallerThanWindow))
    || ((cellPosition == "TOP_IN_VIEWPORT") && (tallerThanWindow))
    ){ // in these cases, scroll the window such that the cell top is at the window top
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else if ( ((cellPosition == "BELOW_VIEWPORT") && !(tallerThanWindow))
    || ((cellPosition == "TOP_IN_VIEWPORT") && !(tallerThanWindow))
    ){ //in these cases, scroll the window such that the cell bottom is at the window bottom
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }
}

function addExternalScript(scriptUrl){
  // FIXME there must be a better way to do this with promises etc...
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scriptUrl;
  head.appendChild(script);
}

let cell = function (state = newBlankState(), action) {
  switch (action.type) {
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
      var newState = Object.assign({}, state)
      var cells = newState.cells.slice()
      cells.forEach((cell)=>{cell.selected = false; return cell})
      var nextCell = newCell(newState, action.cellType)
      nextCell.selected = true
      var nextState = Object.assign({}, state, {
        cells: [...cells, nextCell],
        currentlySelected: Object.assign({}, nextCell)
      })
      return nextState

    case 'DESELECT_ALL':
      var cells = state.cells.slice()
      cells.forEach((c)=>{c.selected=false; return c})
      return Object.assign({}, state, {cells}, {currentlySelected: undefined})

    case 'CHANGE_MODE':
      var mode = action.mode
      return Object.assign({}, state, {mode});

    case 'SELECT_CELL':
      var cells = state.cells.slice()
      var index = cells.findIndex(c=>c.id===action.id)
      var thisCell = cells[index]
      cells.forEach((c)=>c.selected=false)
      thisCell.selected = true
      cells[index] = thisCell
      var currentlySelected = thisCell;

      if (action.scrollToCell) { scrollToCellIfNeeded(thisCell.id) }

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
      var index = cells.findIndex(c=>c.id===action.id)
      var thisCell = cells[index];
      thisCell.cellType = action.cellType;
      thisCell.value = undefined;
      thisCell.rendered = false;
      cells[index] = thisCell;
      var nextState = Object.assign({}, state, {cells})
      return nextState

    case 'CLEAR_CELL_BEFORE_EVALUATION':
      var newState = Object.assign({}, state)
      var cells = newState.cells.slice()
      var index = cells.findIndex(c=>c.id===action.id)
      var thisCell = cells[index]
      thisCell.executionStatus = "*"
      thisCell.value = undefined
      cells[index] = thisCell
      var nextState = Object.assign({}, newState, {cells})
      return nextState

    case 'MARK_CELL_NOT_RENDERED':
      var cells = state.cells.slice();
      var index = cells.findIndex(c=>c.id===action.id)
      var thisCell = cells[index];
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
      var executionNumber = newState.executionNumber


      if (action.evaluateCell) {
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

          // ok. Now let's see if there are any new declared variables.
          declaredProperties = {} //
          var currentGlobal = Object.keys(window)
          currentGlobal.forEach((g)=>{
            if (!initialVariables.has(g)) {
              declaredProperties[g] = window[g]
            }
          })

          var lastValue;
          newState.executionNumber++
          thisCell.executionStatus = ""+newState.executionNumber
        } else if (thisCell.cellType === 'markdown') {
          // one line, huh.
          thisCell.value = MD.render(thisCell.content);
          thisCell.rendered = true;
        } else if (thisCell.cellType === 'external scripts') {
          var scriptUrls = thisCell.content.split("\n").filter(s => s!="");
          var newScripts = scriptUrls.filter(script => !newState.externalScripts.includes(script));
          newScripts.forEach(addExternalScript)
          newState.externalScripts.push(...newScripts)
          thisCell.value = "loaded scripts";
          thisCell.rendered = true;
          // add to newState.history
          newState.history.push({
            cellID: thisCell.id,
            lastRan: new Date(),
            content: "// added external scripts:\n" + ( newScripts.map(s => "// "+s).join("\n") )
          })

          newState.executionNumber++
          thisCell.executionStatus = ""+newState.executionNumber

        }
      } else {
        thisCell.rendered = false;
      }
      
      cells[index] = thisCell;
      var nextState = Object.assign({}, newState, {cells}, {declaredProperties});
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
        currentlySelected = Object.assign({}, cells[nextIndex])
      } else {
        currentlySelected = Object.assign({}, state.currentlySelected)
      }

      var nextState = Object.assign({}, state, {
        cells: cells.filter((cell)=> {return cell.id !== action.id})
      }, {currentlySelected})
      return nextState

    case 'CHANGE_ELEMENT_TYPE':
       var cells = state.cells.slice()
      var index = cells.findIndex(c=>c.id===action.id)
      var thisCell = cells[index]
      thisCell.elementType = action.elementType
      cells[index] = thisCell
      return Object.assign({}, state, {cells})

    case 'CHANGE_DOM_ELEMENT_ID':
      var cells = state.cells.slice()
      var index = cells.findIndex(c=>c.id===action.id)
      var thisCell = cells[index]
      thisCell.domElementID = action.elemID
      cells[index] = thisCell
      return Object.assign({}, state, {cells})

      default:
        return state
  }
}

export default cell