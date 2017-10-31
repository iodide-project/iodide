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


class Page extends React.Component {
  constructor(props) {
    console.log(props)
    super(props)
    this.props.actions.newNotebook()
    this.getSelectedCell = this.getSelectedCell.bind(this)
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

    getSelectedCell(){
        return getSelectedCell(this.props.cells)
    }

  render () {
    var bodyContent = this.props.cells.map((cell,i)=> {
        let id = cell.id
        switch (cell.cellType){
            case 'javascript':
                return <JavascriptCell cellId={id} key={id}/> 
            case 'markdown':
                return <MarkdownCell cellId={id} key={cell.id}/>
            case 'raw':
                return <RawCell cellId={id} key={id}/>
            case 'external scripts':
                return <ExternalScriptCell cellId={id} key={id}/>
            case 'dom':
                return <DOMCell cellId={id} key={id}/>
        }
        return cellComponent
    });

    var sp = <span></span>
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
    // FIXME: don't pass full state
    // re cells: only pass list of cell ids
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)