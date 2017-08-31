import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Mousetrap from 'mousetrap'

import actions from './actions.jsx'
import Cell from './cell.jsx'
import DeclaredProperties from './declared-properties.jsx'


Mousetrap.prototype.stopCallback  = function () {
     return false;
}

class Page extends React.Component {
  constructor(props) {
    super(props)

    // TODO: this is messy and could use refactoring.

    Mousetrap.bind(['shift+up'], ()=>{
      if (this.props.mode === 'command' && this.props.currentlySelected != undefined) this.props.actions.cellUp(this.props.currentlySelected.id)
    })

    Mousetrap.bind(['shift+down'], ()=>{
      if (this.props.mode === 'command' && this.props.currentlySelected != undefined) this.props.actions.cellDown(this.props.currentlySelected.id)
    })

    Mousetrap.bind(['a'], ()=>{
      if (this.props.mode === 'command') {
        if (this.props.currentlySelected != undefined) {
          this.props.actions.insertCell('javascript', this.props.currentlySelected.id, 'above')
        } else {
          this.props.actions.addCell('javascript')
        }
      }
    })

    Mousetrap.bind(['b'], ()=>{
      if (this.props.mode === 'command') {
        if (this.props.currentlySelected != undefined) {
          this.props.actions.insertCell('javascript', this.props.currentlySelected.id, 'below')
        } else {
          this.props.actions.addCell('javascript')
        }
      }
    })

    Mousetrap.bind(['j'], ()=>{
      if (this.props.mode === 'command' && this.props.currentlySelected != undefined) {
        this.props.actions.changeCellType(this.props.currentlySelected.id, 'javascript')
      }
    })

    Mousetrap.bind(['m'], ()=>{
      if (this.props.mode === 'command' && this.props.currentlySelected!= undefined) {
        this.props.actions.changeCellType(this.props.currentlySelected.id, 'markdown')
      }
    })

    Mousetrap.bind(['r'], ()=>{
      if (this.props.mode === 'command' && this.props.currentlySelected!= undefined) {
        this.props.actions.changeCellType(this.props.currentlySelected.id, 'raw')
      }
    })

    Mousetrap.bind(['up'], ()=>{
      if (this.props.mode === 'command') {
        if (this.props.currentlySelected != undefined) {
          var selectedID = this.props.currentlySelected.id
          
          var order = this.props.cells
            .map((d,i)=>{return [i,d]})
            .filter((di)=>di[1].id == selectedID)[0][0]

          if (order > 0) {
            var nextID = this.props.cells[order-1].id
            this.props.actions.selectCell(nextID)
          }

        } else {
          if (this.props.cells.length) {
            this.props.actions.selectCell(0)
          }
        }
      }
    })

    Mousetrap.bind(['down'], ()=>{
      if (this.props.mode === 'command') {
        if (this.props.currentlySelected != undefined) {

          var selectedID = this.props.currentlySelected.id

          var order = this.props.cells
              .map((d,i)=>{return [i,d]})
              .filter((di)=>di[1].id == selectedID)[0][0]

          if (order < this.props.cells.length-1) {
            var nextID = this.props.cells[order+1].id
            this.props.actions.selectCell(nextID)
          }

        } else {
          if (this.props.cells.length) {
            this.props.actions.selectCell(0)
          }
        }
      }
    })

    Mousetrap.bind(['mod+enter', 'mod+return'], ()=>{
      if (this.props.mode === 'command' && this.props.currentlySelected!=undefined) {
        this.props.actions.renderCell(this.props.currentlySelected.id)
      } 
    })

    Mousetrap.bind(['escape', 'esc'], (e)=>{
      if (this.props.mode !== 'command') this.props.actions.changeMode('command')
      this.refs.deselector.focus()
    })

    Mousetrap.bind(['enter', 'return'], (e)=>{
      if (this.props.mode !== 'edit') this.props.actions.changeMode('edit')
      if (this.props.currentlySelected != undefined) {
        var selectedID = this.props.currentlySelected.id
        this.refs['cell'+selectedID].selectCell()
      }
    })

    Mousetrap.bind(['shift+del', 'd d'], ()=>{
      if (this.props.currentlySelected != undefined) {
        var selectedID = this.props.currentlySelected.id
        var nextID;
        this.props.actions.deleteCell(selectedID)
        if (!this.props.cells.length) return
        if (selectedID === this.props.cells.length-1) nextID = this.props.cells.length-2
        else nextID = this.props.cells[this.props.cells.findIndex(c=>c.id===selectedID)+1].id
        this.props.actions.selectCell(nextID)
      }
    })

  }

  addCell() {
    this.props.actions.addCell('javascript');
  }

  render () {
    var cells = this.props.cells.map((cell,i)=> {
      return <Cell ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
    });
    var declaredPropertiesPane;
    if (Object.keys(this.props.declaredProperties).length) {
      declaredPropertiesPane = <DeclaredProperties state={this.props.declaredProperties} />
    } else {
      declaredPropertiesPane = <div></div>
    }

    return (
        <div>
        <div id='deselector'>
          <input ref='deselector' />
        </div>
          <h1 ref='pageTitle' className='page-title'>Javascript Notebook <span>{this.props.mode}</span></h1>
          <div className='controls'>
          	<button ref='addCellButton' onClick={this.addCell.bind(this)}> + </button>
          </div>

          <div className='cells'>
          	{cells}
          </div>
            
          {declaredPropertiesPane}

        </div>
    );
  }
}

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)