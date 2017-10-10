import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Mousetrap from 'mousetrap'

import actions from './actions.jsx'
import {JavascriptCell, MarkdownCell, RawCell, HistoryCell, ExternalScriptCell, DOMCell} from './cell.jsx'
import DeclaredVariables from './declared-variables.jsx'
import keyBinding from './keybindings.jsx' 
import Title from './title.jsx'
import NotebookMenu from './notebook-menu.jsx'
import settings from './settings.jsx'
import {getSelectedCell} from './notebook-utils'

import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label, DropdownButton, MenuItem, 
        SplitButton, FormGroup, FormControl, ControlLabel, Form, Col } from 'react-bootstrap'

const AUTOSAVE = settings.labels.AUTOSAVE

class SidePane extends React.Component {
  constructor(props) {
    super(props)
    this.exitSidePane = this.exitSidePane.bind(this)
  }

  exitSidePane() {

    this.props.actions.changeSidePaneMode(undefined)
  }

  render() {

    //
    var contents=[];
    if (this.props.sidePaneMode === 'history') {
      if (this.props.history.length) {
        contents = this.props.history.map((cell,i)=> {
          var cellComponent = <HistoryCell display={true} ref={'cell'+cell.id} actions={this.props.actions} cell={cell} id={i+'-'+cell.id} key={'history'+i} />
          return cellComponent
        })
      } else {
        contents.push(<div className='no-history'>No History</div>)
      }
    } else if (this.props.sidePaneMode == 'declared variables') {
      contents = <DeclaredVariables variables={this.props.declaredProperties}  />
    }

    return (
      <div className='side-pane'>
        <div><i onClick={this.exitSidePane} className="fa fa-times close-side-pane" aria-hidden="true"></i></div>
        {contents}
      </div>
    )
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.props.actions.newNotebook()
    this.addCell = this.addCell.bind(this)
    this.renderCell = this.renderCell.bind(this)
    this.cellUp = this.cellUp.bind(this)
    this.cellDown = this.cellDown.bind(this)
    this.getSelectedCell = this.getSelectedCell.bind(this)

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
      this.props.actions.saveNotebook(AUTOSAVE + (this.props.title == undefined ? 'new notebook' : this.props.title))
    },1000*60)
  }

  addCell() {
    this.props.actions.addCell('javascript')
  }

  renderCell(render) {
    this.props.actions.renderCell(this.getSelectedCell().id)
    }

    cellUp(){
    this.props.actions.cellUp(this.getSelectedCell().id)
    }

    cellDown(){
    this.props.actions.cellDown(this.getSelectedCell().id)
    }

    changeCellType(cellType, evt){
        this.props.actions.changeCellType(this.props.cell.id, cellType)
    }

    getSelectedCell(){
        return getSelectedCell(this.props.cells)
    }

  makeButtons(){
        return (
            <div className={'cell-controls controls-visible'}>
                <ButtonToolbar >
                    <Button bsSize='xsmall' onClick={this.renderCell}><i className="fa fa-play" aria-hidden="true"></i></Button>
                    <Button bsSize='xsmall' onClick={this.cellDown}><i className="fa fa-level-down" aria-hidden="true"></i></Button>
                    <Button bsSize='xsmall' onClick={this.cellUp}><i className="fa fa-level-up" aria-hidden="true"></i></Button>
                    <Button bsSize='xsmall' onClick={this.addCell}><i className="fa fa-plus" aria-hidden="true"></i></Button>
                      <DropdownButton bsSize="xsmall"
                        bsStyle='default' title={this.getSelectedCell().cellType}
                        onSelect={this.changeCellType} >
                        <MenuItem eventKey={"javascript"} >JS</MenuItem>
                        <MenuItem eventKey={'markdown'} >MD</MenuItem>
                        <MenuItem eventKey={'raw'} >Raw</MenuItem>
                        <MenuItem eventKey={'dom'} >DOM</MenuItem>
                        <MenuItem eventKey={'external scripts'} >External Script</MenuItem>
                    </DropdownButton>
                </ButtonToolbar>
            </div>
        )
    }

  render () {
    var bodyContent = []

    var bodyContent = this.props.cells.map((cell,i)=> {
      var cellComponent
      if (cell.cellType === 'javascript') cellComponent = <JavascriptCell display={true} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      if (cell.cellType === 'markdown') cellComponent = <MarkdownCell display={true} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      if (cell.cellType === 'raw') cellComponent = <RawCell display={true} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      if (cell.cellType === 'external scripts') cellComponent = <ExternalScriptCell display={true} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      if (cell.cellType === 'dom') cellComponent = <DOMCell display={true} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      return cellComponent
    });

    var sp = <span></span>
    if (this.props.sidePaneMode !== undefined) sp = <SidePane 
        sidePaneMode={this.props.sidePaneMode} 
        pageMode={this.props.pageMode}
        cells={this.props.cells}
        history={this.props.history}
        declaredProperties={this.props.declaredProperties}
        actions={this.props.actions} />
    
    var pageControls = <div className='controls'>
        <i className='fa fa-plus add-cell' onClick={this.addCell}></i>
    </div>

    return (
        <div id="notebook-container">
            <div id="headerbar">
                <Title actions={this.props.actions}
                    title={this.props.title}
                    pageMode={this.props.mode} />
                <div id="menu-containter">
                    <NotebookMenu actions={this.props.actions}
                        mode={this.props.mode}
                        sidePaneMode={this.props.sidePaneMode}
                        lastSaved={this.props.lastSaved}
                        currentTitle={this.props.title} />
                    <div className='page-mode'>{this.props.mode}</div>
                    <div id='deselector'><input ref='deselector' /></div>
                    {this.makeButtons()}
                </div>
                
            </div>
            <div id='cells'>
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