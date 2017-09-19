var jupyterKeybindings = [];

var moveCell = (elem, dirFcn) => {
  if (elem.props.mode === 'command' && elem.props.currentlySelected != undefined) elem.props.actions[dirFcn](elem.props.currentlySelected.id)
}

var MOVE_UP = [
    ['shift+up'], 
    function(){
      moveCell(this, 'cellUp')
    }
]

var MOVE_DOWN = [
    ['shift+down'], 
    function(){
      moveCell(this, 'cellDown')
    }
]

var ADD_CELL_ABOVE = [['a'], function(){
    if (this.props.mode === 'command') {
      if (this.props.currentlySelected != undefined) {
        this.props.actions.insertCell('javascript', this.props.currentlySelected.id, 'above')
      } else {
        this.props.actions.addCell('javascript')
      }
    }
  }
]

var ADD_CELL_BELOW = [['b'], function(){
    if (this.props.mode === 'command') {
      if (this.props.currentlySelected != undefined) {
        this.props.actions.insertCell('javascript', this.props.currentlySelected.id, 'below')
      } else {
        this.props.actions.addCell('javascript')
      }
    }
  }
]

function changeCellMode(elem, cellMode) {
  if (elem.props.mode === 'command' && elem.props.currentlySelected != undefined) {
    elem.props.actions.changeCellType(elem.props.currentlySelected.id, cellMode)
  }  
}

var JAVASCRIPT_MODE = [['j'], function(){
    changeCellMode(this, 'javascript')
    }
]

var MARKDOWN_MODE = [['m'], function(){
    changeCellMode(this, 'markdown')
    }
]

var RAW_MODE = [['r'], function(){
    changeCellMode(this, 'raw')
    }
]
 
var DESELECT = [['shift+esc', 'shift+escape'], function(){
  this.props.actions.deselectAll()
}]

function changeSelection(elem, dir) {
  if (elem.props.mode === 'command' && elem.props.cells.length) {
    if (elem.props.currentlySelected != undefined) {

      var selectedID = elem.props.currentlySelected.id
      
      var order = elem.props.cells.findIndex((c)=> c.id == selectedID)

      var orderConditional = dir > 0 ? order < elem.props.cells.length-1 : order > 0
      if (orderConditional) {
        var nextID = elem.props.cells[order+dir].id
        elem.props.actions.selectCell(nextID)
      }

    } else {
      if (elem.props.cells.length) {
        elem.props.actions.selectCell(elem.props.cells[0].id)
      }
    }
  }  
}


var SELECT_UP = [['up'], function(){
    changeSelection(this, -1)
  }
]

var SELECT_DOWN = [['down'], function(){
  changeSelection(this, 1)
  }
]

var RENDER_CELL = [['mod+enter'], function(){
      if (this.props.currentlySelected!=undefined) {
        this.props.actions.renderCell(this.props.currentlySelected.id)
        this.props.actions.changeMode('command')
      } 
    }
]

var RENDER_AND_SELECT_BELOW = [['shift+enter'], function(){
  if (this.props.currentlySelected!=undefined) {
    this.props.actions.renderCell(this.props.currentlySelected.id)
    this.props.actions.changeMode('command')
    var cells = this.props.cells.slice()
    var index = cells.findIndex(c=>c.id===this.props.currentlySelected.id)
    if (index == cells.length-1) this.props.actions.addCell('javascript')
    changeSelection(this, 1)
  }
}]

var COMMAND_MODE = [['esc'], function(e){
      if (this.props.mode == 'edit') {
        this.props.actions.changeMode('command')
        this.refs.deselector.focus()
      }
      // see issue #50
      // else if (this.props.mode == 'command' && this.props.currentlySelected !== undefined) {
      //   this.props.actions.deselectAll()
      // }
    }
]

var EDIT_MODE = [['enter', 'return'], function(e){
      if (this.props.mode !== 'edit') this.props.actions.changeMode('edit')
      if (this.props.currentlySelected != undefined) {
        var selectedID = this.props.currentlySelected.id
        this.refs['cell'+selectedID].selectCell()
      }
    }
]

var DELETE_CELL = [['shift+del', 'shift+backspace'], function(){
    if (this.props.currentlySelected != undefined) {
      this.props.actions.deleteCell(this.props.currentlySelected.id)
    }
  }
]

jupyterKeybindings.push(DESELECT)
jupyterKeybindings.push(JAVASCRIPT_MODE)
jupyterKeybindings.push(MARKDOWN_MODE)
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

export default jupyterKeybindings