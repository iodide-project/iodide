import {getSelectedCell} from './notebook-utils'

var jupyterKeybindings = [];

var moveCell = (elem, dirFcn) => {
  var currentlySelected = getSelectedCell(elem.props.cells)
  if (elem.props.mode === 'command' && currentlySelected != undefined) elem.props.actions[dirFcn](currentlySelected.id)
}

var MOVE_UP = [['shift+up'], function(){
      if (this.props.mode == 'command') moveCell(this, 'cellUp')
    }
]

var MOVE_DOWN = [['shift+down'], function(){
      if (this.props.mode == 'command') moveCell(this, 'cellDown')
    }
]

var ADD_CELL_ABOVE = [['a'], function(){
  var currentlySelected = getSelectedCell(this.props.cells)
    if (this.props.mode === 'command') {
      if (currentlySelected != undefined) {
        this.props.actions.insertCell('javascript', currentlySelected.id, 'above')
        changeSelection(this, -1)
      } else {
        this.props.actions.addCell('javascript')
      }
    }
  }
]

var ADD_CELL_BELOW = [['b'], function(){
  var currentlySelected = getSelectedCell(this.props.cells)
    if (this.props.mode === 'command') {
      if (currentlySelected != undefined) {
        this.props.actions.insertCell('javascript', currentlySelected.id, 'below')
        changeSelection(this, 1)
      } else {
        this.props.actions.addCell('javascript')
      }
    }
  }
]

function changeCellMode(elem, cellMode) {
  var currentlySelected = getSelectedCell(elem.props.cells)
  if (elem.props.mode === 'command' && currentlySelected != undefined) {
    elem.props.actions.changeCellType(currentlySelected.id, cellMode)
  }  
}

var JAVASCRIPT_MODE = [['j'], function(){
    if (this.props.mode == 'command') changeCellMode(this, 'javascript')
    }
]

var MARKDOWN_MODE = [['m'], function(){
    if (this.props.mode == 'command') changeCellMode(this, 'markdown')
    }
]

var EXTERNAL_SCRIPTS_MODE = [['e'], function(){
  if (this.props.mode == 'command') changeCellMode(this, 'external scripts')
  }
]

var RAW_MODE = [['r'], function(){
    if (this.props.mode == 'command') changeCellMode(this, 'raw')
    }
]

var SAVE_NOTEBOOK = [['ctrl+s', 'meta+s'], function(e){
  if (e.preventDefault) {
    e.preventDefault()
  } else {e.returnValue = false }
  this.props.actions.saveNotebook(this.props.title)
}]

var EXPORT_NOTEBOOK = [['ctrl+e', 'meta+e'], function(e){
  // if (e.preventDfault) e.preventDefault()
  // else e.returnValue = false
  this.props.actions.exportNotebook()
}]


var DESELECT = [['shift+esc', 'shift+escape'], function(){
  this.props.actions.deselectAll()
}]

function changeSelection(elem, dir, scrollToCell = true) {
  // always scroll to cell with kbd actions
  if (elem.props.mode === 'command' && elem.props.cells.length) {
    var currentlySelected = getSelectedCell(elem.props.cells)
    if (currentlySelected !== undefined) {

      var selectedID = currentlySelected.id
      
      var order = elem.props.cells.findIndex((c)=> c.id == selectedID)

      var orderConditional = dir > 0 ? order < elem.props.cells.length-1 : order > 0
      if (orderConditional) {
        var nextID = elem.props.cells[order+dir].id
        elem.props.actions.selectCell(nextID, scrollToCell)
      }

    } else {
      if (elem.props.cells.length) {
        console.log(elem.props.cells.map((c)=>{return c.selected}))
        elem.props.actions.selectCell(elem.props.cells[0].id, scrollToCell)
      }
    }
  }  
}


var SELECT_UP = [['up'], function(e){
    // e.preventDefault blocks kbd scrolling of entire window
    if (e.preventDefault) {
        e.preventDefault();
    } else { // internet explorer
        e.returnValue = false;
    }
    changeSelection(this, -1)
  }
]

var SELECT_DOWN = [['down'], function(e){
    // e.preventDefault blocks kbd scrolling of entire window
    if (e.preventDefault) {
        e.preventDefault();
    } else { // internet explorer
        e.returnValue = false;
    }
  changeSelection(this, 1)
  }
]

var RENDER_CELL = [['mod+enter'], function(){
      var currentlySelected = getSelectedCell(this.props.cells)
      if (currentlySelected != undefined) {
        document.activeElement.blur()
        this.props.actions.renderCell(currentlySelected.id)
        this.props.actions.changeMode('command')
      } 
    }
]

var RENDER_AND_SELECT_BELOW = [['shift+enter'], function(){
  var currentlySelected = getSelectedCell(this.props.cells)
  if (currentlySelected!=undefined) {
    // currentlySelected does in theory change after each of these actions, 
    // so we need to keep pulling if we need them.
    document.activeElement.blur()
    this.props.actions.renderCell(currentlySelected.id)
    this.props.actions.changeMode('command')
    
    var currentlySelected = getSelectedCell(this.props.cells)
    var cells = this.props.cells.slice()
    var index = cells.findIndex(c=>c.id===currentlySelected.id)
    if (index == cells.length-1) this.props.actions.addCell('javascript')
    changeSelection(this, 1)
  }
}]

var COMMAND_MODE = [['esc'], function(e){
      if (this.props.mode == 'edit') {
        document.activeElement.blur()
        this.props.actions.changeMode('command')
      }
    }
]

var EDIT_MODE = [['enter', 'return'], function(e){
    if (this.props.mode == 'command'){
        // e.preventDefault blocks inserting a newline when you transition to edit mode
        if (e.preventDefault) {
            e.preventDefault();
        } else { // internet explorer
            e.returnValue = false;
        }
        this.props.actions.changeMode('edit')
    }
    var currentlySelected = getSelectedCell(this.props.cells)
    if (currentlySelected != undefined) {
        var selectedID = currentlySelected.id
        this.refs['cell'+selectedID].enterEditMode()
      }
    }
]

var DELETE_CELL = [['shift+del', 'shift+backspace'], function(){
  var currentlySelected = getSelectedCell(this.props.cells)
    if (currentlySelected != undefined
        && this.props.mode == 'command') {
      this.props.actions.deleteCell(currentlySelected.id)
    }
  }
]

jupyterKeybindings.push(DESELECT)
jupyterKeybindings.push(JAVASCRIPT_MODE)
jupyterKeybindings.push(MARKDOWN_MODE)
jupyterKeybindings.push(EXTERNAL_SCRIPTS_MODE)
jupyterKeybindings.push(RAW_MODE)
jupyterKeybindings.push(SELECT_UP)
jupyterKeybindings.push(SELECT_DOWN)
jupyterKeybindings.push(ADD_CELL_ABOVE)
jupyterKeybindings.push(ADD_CELL_BELOW)
jupyterKeybindings.push(MOVE_UP)
jupyterKeybindings.push(MOVE_DOWN)
jupyterKeybindings.push(EDIT_MODE)
jupyterKeybindings.push(COMMAND_MODE)
jupyterKeybindings.push(RENDER_CELL)
jupyterKeybindings.push(RENDER_AND_SELECT_BELOW)
jupyterKeybindings.push(DELETE_CELL)
jupyterKeybindings.push(SAVE_NOTEBOOK)
jupyterKeybindings.push(EXPORT_NOTEBOOK)

export default jupyterKeybindings