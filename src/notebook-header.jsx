import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions.jsx'

import settings from './settings.jsx'

import {HistoryCell} from './cell.jsx'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import {red500, yellow500, blue500, grey900,grey50} from 'material-ui/styles/colors'

import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import HistoryIcon from 'material-ui/svg-icons/action/history'
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import DropDownMenu from 'material-ui/DropDownMenu'
import Subheader from 'material-ui/Subheader'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import FontIcon from 'material-ui/FontIcon'

import Drawer from 'material-ui/Drawer'

import MainMenu from './menu-component.jsx'
import DeclaredVariables from './declared-variables.jsx'
import {prettyDate, formatDateString} from './notebook-utils'

import Title from './title.jsx'

// TODO: replace settings w/ a settings file that we can share everywhere.

const AUTOSAVE = settings.labels.AUTOSAVE

function stateIsValid(state) {
  // TODO - fill this out and figure out if everything is in order.
  return state !== undefined // for now ...
}

class NotebookHeader extends React.Component {
  constructor(props) {
    super(props)
    this.notebookFileImport = this.notebookFileImport.bind(this)
    this.state = {previousMode: props.mode}
  }

  notebookFileImport(evt) {
    let fn = evt.target.files[0]
    let reader = new FileReader()
    reader.onload = (result) => {
      let newState
      try {
        newState = JSON.parse(result.target.result)  
      } catch(e) {
        console.error(e)
      }
      if (stateIsValid(newState)) {
        this.props.actions.importNotebook(newState)
      }
    }
    reader.readAsText(fn)
  }

  render() {
    console.log('NotebookHeader render')
    let histContents = []
    if (this.props.history.length) {
      histContents = this.props.history.filter(cell=>cell.content.length).map((cell,i)=> {
        let cellComponent = <HistoryCell display={true} ref={'cell'+cell.id} actions={this.props.actions} cell={cell} id={i+'-'+cell.id} key={'history'+i} />
        return cellComponent
      })
    } else {
      histContents.push(<div className='no-history'>No History</div>)
    }

    return (
      <div className='notebook-header'>
        <input id='import-notebook' 
          name='file'
          type='file' style={{display:'none'}} onChange={this.notebookFileImport} 
        />
        <a id='export-anchor' style={{display: 'none'}} ></a>
        <div className='notebook-menu' style={{display: this.props.viewMode === 'editor' ? 'block' : 'none'}}>
          <EditorMenu actions={this.props.actions}
            mode={this.props.mode}
            viewMode={this.props.viewMode}
            title={this.props.title}
            sidePaneMode={this.props.sidePaneMode}
            lastSaved={this.props.lastSaved} />
        </div>
        <div className='presentation-menu' style={{display: (this.props.viewMode === 'presentation' ? 'block' : 'none')}} >
          <PresentationMenu
            mode={this.props.mode}
            viewMode={this.props.viewMode}
            title={this.props.title}
            actions={this.props.actions}
            sidePaneMode={this.props.sidePaneMode}
            lastSaved={this.props.lastSaved} />
        </div>

        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Drawer 
            width={600} 
            docked={false}
            open={this.props.sidePaneMode==='declared variables'} 
            openSecondary={true}
            overlayStyle={{backgroundColor: 'none'}}
            onRequestChange={(open, request) => {this.props.actions.changeSidePaneMode(undefined)} } >
            <h1 className='overlay-title'>Declared Variables</h1>
            <DeclaredVariables variables={this.props.declaredVariables} />
          </Drawer>
        </MuiThemeProvider>

        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Drawer 
            width={600} 
            docked={false}
            open={this.props.sidePaneMode==='history'} 
            openSecondary={true}
            overlayStyle={{backgroundColor: 'none'}}
            onRequestChange={(open, request) => {this.props.actions.changeSidePaneMode(undefined)} } >
            <h1 className='overlay-title'>Execution History</h1>
            <div className='history-cells'> {histContents} </div>
          </Drawer>
        </MuiThemeProvider>
      </div>
    )
  }
}







class PresentationMenu extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='presentation-header'>
        <div className='view-mode-toggle-from-presentation'> 
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <ViewModeToggleButton textColor='black' actions={this.props.actions} viewMode={this.props.viewMode} />
          </MuiThemeProvider>
        </div>
        <h1 className='presentation-title' style={{color: this.props.title === undefined ? 'gray' : 'black'}}>{this.props.title || 'new notebook'}</h1>
      </div>
    )
  }
}









class EditorMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {previousMode: props.mode}
  }

  changeSidePaneMode(sidePaneMode) {
    if (this.props.sidePaneMode === sidePaneMode) this.props.actions.changeSidePaneMode(undefined)
    else this.props.actions.changeSidePaneMode(sidePaneMode)
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Toolbar style={{backgroundColor: 'black'}}>
          <MainMenu 
            isFirstChild={true}
            actions={this.props.actions} 
            mode={this.props.mode}
            title={this.props.title}
            viewMode={this.props.viewMode}
            sidePaneMode={this.props.sidePaneMode}
            lastSaved={this.props.lastSaved}
          />
          <ToolbarGroup className='title-field'>
            <Title actions={this.props.actions}
              title={this.props.title}
              pageMode={this.props.mode} />
          </ToolbarGroup>
          <ToolbarGroup id='notebook-view-mode-controls' className='mode-buttons'>
            <ToolbarTitle style={{fontSize:'13px', color:'lightgray', fontStyle: 'italic'}} text={this.props.lastSaved === undefined ? ' ' : 'last saved: ' + prettyDate(this.props.lastSaved)} />
            <IconButton 
              tooltip='Declared Variables'
              style={{color: '#fafafa'}} 
              onClick={()=>{this.props.actions.changeSidePaneMode('declared variables')}} >
              <ArrowDropDown />
            </IconButton>
            <IconButton 
              tooltip='History'
              style={{color: '#fafafa'}} 
              onClick={()=>{this.props.actions.changeSidePaneMode('history') }} >
              <HistoryIcon />
            </IconButton>
            <ViewModeToggleButton actions={this.props.actions} viewMode={this.props.viewMode} />
          </ToolbarGroup>
        </Toolbar>
      </MuiThemeProvider>
    )
  }
}







class ViewModeToggleButton extends React.Component {
  constructor(props) {
    super(props)
    this.toggleViewMode = this.toggleViewMode.bind(this)
  }

  toggleViewMode(){
    if (this.props.viewMode=='presentation') {
      this.props.actions.setViewMode('editor')
    } else if (this.props.viewMode=='editor'){
      this.props.actions.setViewMode('presentation')
    }
  }

  render() {
    let buttonString
    if (this.props.viewMode=='presentation'){buttonString='Presentation'}
    else if (this.props.viewMode=='editor'){buttonString='Editor'}
    return (
      <FlatButton style={{color:this.props.textColor || '#fafafa'}} onClick={this.toggleViewMode} hoverColor={this.props.hoverColor || 'darkgray'} label={buttonString} />
    )
  }
}





function mapStateToProps(state) {
  return {
    mode: state.mode,
    viewMode: state.viewMode,
    title: state.title,
    declaredVariables: state.declaredProperties,
    sidePaneMode: state.sidePaneMode,
    lastSaved: state.lastSaved,
    history: state.history,
    currentTitle: state.title
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}
let NotebookHeader_connected = connect(mapStateToProps, mapDispatchToProps)(NotebookHeader)
export {NotebookHeader_connected as NotebookHeader}
// export {NotebookHeader}