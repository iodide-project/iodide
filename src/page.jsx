import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Mousetrap from 'mousetrap'

import actions from './actions.jsx'
import {JavascriptCell, MarkdownCell, RawCell, HistoryCell, ExternalScriptCell, DOMCell} from './cell.jsx'
import DeclaredVariables from './declared-variables.jsx'
import keyBinding from './keybindings.jsx' 
import Title from './title.jsx'
import { NotebookHeader } from './notebook-header.jsx'
import settings from './settings.jsx'
import {getSelectedCell, prettyDate} from './notebook-utils'

import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label, DropdownButton, MenuItem, 
        SplitButton, FormGroup, FormControl, ControlLabel, Form, Col } from 'react-bootstrap'

const AUTOSAVE = settings.labels.AUTOSAVE


// class SidePane extends React.Component {
//   constructor(props) {
//     super(props)
//     this.exitSidePane = this.exitSidePane.bind(this)
//   }

//   exitSidePane() {

//     this.props.actions.changeSidePaneMode(undefined)
//   }

//   render() {
//     var contents=[];
//     if (this.props.sidePaneMode === 'history') {
//       if (this.props.history.length) {
//         contents = this.props.history.map((cell,i)=> {
//           var cellComponent = <HistoryCell display={true} ref={'cell'+cell.id} actions={this.props.actions} cell={cell} id={i+'-'+cell.id} key={'history'+i} />
//           return cellComponent
//         })
//       } else {
//         contents.push(<div className='no-history'>No History</div>)
//       }
//     } else if (this.props.sidePaneMode == 'declared variables') {
//       contents = <DeclaredVariables variables={this.props.declaredProperties} />
//     }

//     return (
//       <div className='side-pane'>
//         <div><i onClick={this.exitSidePane} className="fa fa-times close-side-pane" aria-hidden="true"></i></div>
//         {contents}
//       </div>
//     )
//   }
// }



class Page extends React.Component {
  constructor(props) {
    console.log(props)
    super(props)
    this.props.actions.newNotebook()
    this.addCell = this.insertCell.bind(this)
    this.renderCell = this.renderCell.bind(this)
    this.cellUp = this.cellUp.bind(this)
    this.cellDown = this.cellDown.bind(this)
    this.changeCellType = this.changeCellType.bind(this)
    this.getSelectedCell = this.getSelectedCell.bind(this)
    this.runAllCells = this.runAllCells.bind(this)
    this.enterCommandModeOnClickOutOfCell = this.enterCommandModeOnClickOutOfCell.bind(this)

    keyBinding('jupyter', this)
    setInterval(()=>{
      // clear whatever notebook is defined w/ "AUTOSAVE " as front tag
      var notebooks = Object.keys(localStorage)
      var autos = notebooks.filter((n)=>n.includes(AUTOSAVE))

      if (autos.length) {

        autos.forEach((n)=>{
          this.props.actions.deleteNotebook(n)
        })
      }
      this.props.actions.saveNotebook(AUTOSAVE + (this.props.title == undefined ? 'new notebook' : this.props.title), true)
    },1000*60)
  }

  enterCommandModeOnClickOutOfCell(e) {
    //check whther the click is (1) directly in div#cells (2) in any element contained in the notebook header
    if (e.target.id.includes('cells') ||
        document.querySelector(".notebook-header").contains(e.target)) {
          if (this.props.mode != 'command') this.props.actions.changeMode('command')
    }
  }

  runAllCells() {
    this.props.actions.runAllCells()
  }
  renderCell(render) {
    this.props.actions.renderCell(this.getSelectedCell().id)
    }
  insertCell() {
    this.props.actions.insertCell('javascript', this.getSelectedCell().id, 1)
  }



    cellUp(){
    this.props.actions.cellUp(this.getSelectedCell().id)
    }

    cellDown(){
    this.props.actions.cellDown(this.getSelectedCell().id)
    }

    changeCellType(cellType, evt){
        this.props.actions.changeCellType(this.getSelectedCell().id, cellType)
    }

    getSelectedCell(){
        return getSelectedCell(this.props.cells)
    }

  render () {
    var globalProps = {display:true,
            pageMode: this.props.mode,
            viewMode: this.props.viewMode,
            actions: this.props.actions}
    var bodyContent = this.props.cells.map((cell,i)=> {
        var cellParams = Object.assign({},
            globalProps,
            {ref: 'cell'+cell.id,
                cell: cell,
                key: cell.id,
                id: cell.id
            })
        switch (cell.cellType){
            case 'javascript':
                return <JavascriptCell cellId={cellParams.id}/> 
            case 'markdown':
                return <MarkdownCell {...cellParams}/>
            case 'raw':
                return <RawCell {...cellParams}/>
            case 'external scripts':
                return <ExternalScriptCell {...cellParams}/>
            case 'dom':
                return <DOMCell {...cellParams}/>
        }
        return cellComponent
    });

    var sp = <span></span>
    // if (this.props.sidePaneMode !== undefined) sp = <SidePane 
    //     sidePaneMode={this.props.sidePaneMode} 
    //     pageMode={this.props.pageMode}
    //     cells={this.props.cells}
    //     history={this.props.history}
    //     declaredProperties={this.props.declaredProperties}
    //     actions={this.props.actions} />
    
    // var pageControls = <div className='controls'>
    //     <i className='fa fa-plus add-cell' onClick={this.addCell}></i>
    // </div>

    return (
        <div id="notebook-container"
            className={this.props.viewMode==='presentation' ? 'presentation-mode' : ''}
            onMouseDown={this.enterCommandModeOnClickOutOfCell}>
            <NotebookHeader actions={this.props.actions}
                mode={this.props.mode}
                cells={this.props.cells}
                viewMode={this.props.viewMode}
                title={this.props.title}
                declaredVariables={this.props.declaredProperties}
                sidePaneMode={this.props.sidePaneMode}
                lastSaved={this.props.lastSaved}
                history={this.props.history}
                currentTitle={this.props.title} />
            <div id='cells' className={this.props.viewMode}>
            	{bodyContent}
            </div>
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