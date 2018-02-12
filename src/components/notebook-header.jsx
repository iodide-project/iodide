import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'

import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import HistoryIcon from 'material-ui/svg-icons/action/history'
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Drawer from 'material-ui/Drawer'

import { HistoryItem } from './history-item'
import MainMenu from './menu-component'
import DeclaredVariables from './declared-variables'

import Title from './title'

import { prettyDate } from '../notebook-utils'
import actions from '../actions'

// TODO: replace settings w/ a settings file that we can share everywhere.

function stateIsValid(state) {
  // TODO - fill this out and figure out if everything is in order.
  return state !== undefined // for now ...
}

class NotebookHeader extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    sidePaneMode: PropTypes.oneOf(['history', 'declared variables']),
    mode: PropTypes.oneOf(['title-edit', 'command', 'edit']),
    title: PropTypes.string,
    lastSaved: PropTypes.string,
    actions: PropTypes.shape({
      importNotebook: PropTypes.func.isRequired,
      changeSidePaneMode: PropTypes.func.isRequired,
    }).isRequired,
    history: PropTypes.array,
    declaredVariables: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.notebookFileImport = this.notebookFileImport.bind(this)
  }

  notebookFileImport(evt) {
    const fn = evt.target.files[0]
    const reader = new FileReader()
    reader.onload = (result) => {
      let newState
      try {
        newState = JSON.parse(result.target.result)
      } catch (e) {
        console.error(e)
      }
      if (stateIsValid(newState)) {
        this.props.actions.importNotebook(newState)
      }
    }
    reader.readAsText(fn)
  }

  render() {
    let histContents = []
    if (this.props.history.length) {
      histContents = this.props.history.filter(cell => cell.content.length).map((cell, i) => {
        // TODO: Don't use array indices in keys (See react/no-array-index-key linter)
        const cellComponent = <HistoryItem display ref={`cell${cell.id}`} cell={cell} id={`${i}-${cell.id}`} key={`history${i}`} />  // eslint-disable-line
        return cellComponent
      })
    } else {
      histContents.push(<div className="no-history" key="history_empty">No History</div>)
    }

    return (
      <div className="notebook-header">
        <input
          id="import-notebook"
          name="file"
          type="file"
          style={{ display: 'none' }}
          onChange={this.notebookFileImport}
        />
        <a id="export-anchor" style={{ display: 'none' }} />
        <div className="notebook-menu" style={{ display: this.props.viewMode === 'editor' ? 'block' : 'none' }}>
          <EditorMenu
            actions={this.props.actions}
            mode={this.props.mode}
            viewMode={this.props.viewMode}
            title={this.props.title}
            sidePaneMode={this.props.sidePaneMode}
            lastSaved={this.props.lastSaved}
            cellIdList={this.props.cellIdList}
            cellTypeList={this.props.cellTypeList}
          />
        </div>
        <div className="presentation-menu" style={{ display: (this.props.viewMode === 'presentation' ? 'block' : 'none') }} >
          <PresentationMenu
            mode={this.props.mode}
            viewMode={this.props.viewMode}
            title={this.props.title}
            actions={this.props.actions}
            sidePaneMode={this.props.sidePaneMode}
            lastSaved={this.props.lastSaved}
          />
        </div>

        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Drawer
            width={600}
            docked={false}
            open={this.props.sidePaneMode === 'declared variables'}
            openSecondary
            overlayStyle={{ backgroundColor: 'none' }}
            onRequestChange={() => { this.props.actions.changeSidePaneMode(undefined) }}
          >
            <h1 className="overlay-title">Declared Variables</h1>
            <DeclaredVariables variables={this.props.declaredVariables} />
          </Drawer>
        </MuiThemeProvider>

        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Drawer
            width={600}
            docked={false}
            open={this.props.sidePaneMode === 'history'}
            openSecondary
            overlayStyle={{ backgroundColor: 'none' }}
            onRequestChange={() => { this.props.actions.changeSidePaneMode(undefined) }}
          >
            <h1 className="overlay-title">Execution History</h1>
            <div className="history-cells"> {histContents} </div>
          </Drawer>
        </MuiThemeProvider>
      </div>
    )
  }
}


class PresentationMenu extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    title: PropTypes.string,
  }
  render() {
    return (
      <div className="presentation-header">
        <div className="view-mode-toggle-from-presentation">
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <ViewModeToggleButton textColor="black" actions={this.props.actions} viewMode={this.props.viewMode} />
          </MuiThemeProvider>
        </div>
        <h1 className="presentation-title" style={{ color: this.props.title === undefined ? 'gray' : 'black' }}>{this.props.title || 'new notebook'}</h1>
      </div>
    )
  }
}


class EditorMenu extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    sidePaneMode: PropTypes.oneOf(['history', 'declared variables']),
    mode: PropTypes.oneOf(['title-edit', 'command', 'edit']),
    actions: PropTypes.shape({
      changeSidePaneMode: PropTypes.func.isRequired,
    }).isRequired,
    title: PropTypes.string,
    lastSaved: PropTypes.string,
  }
  changeSidePaneMode(sidePaneMode) {
    if (this.props.sidePaneMode === sidePaneMode) this.props.actions.changeSidePaneMode(undefined)
    else this.props.actions.changeSidePaneMode(sidePaneMode)
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Toolbar style={{ backgroundColor: 'black' }}>
          <MainMenu
            isFirstChild
            actions={this.props.actions}
            mode={this.props.mode}
            title={this.props.title}
            viewMode={this.props.viewMode}
            sidePaneMode={this.props.sidePaneMode}
            lastSaved={this.props.lastSaved}
            cellIdList={this.props.cellIdList}
            cellTypeList={this.props.cellTypeList}
          />
          <ToolbarGroup className="title-field">
            <Title
              actions={this.props.actions}
              title={this.props.title}
              pageMode={this.props.mode}
            />
          </ToolbarGroup>
          <ToolbarGroup id="notebook-view-mode-controls" className="mode-buttons">
            <ToolbarTitle style={{ fontSize: '13px', color: 'lightgray', fontStyle: 'italic' }} text={this.props.lastSaved === undefined ? ' ' : `last saved: ${prettyDate(this.props.lastSaved)}`} />
            <IconButton
              tooltip="Declared Variables"
              style={{ color: '#fafafa' }}
              onClick={() => { this.props.actions.changeSidePaneMode('declared variables') }}
            >
              <ArrowDropDown />
            </IconButton>
            <IconButton
              tooltip="History"
              style={{ color: '#fafafa' }}
              onClick={() => { this.props.actions.changeSidePaneMode('history') }}
            >
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
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    actions: PropTypes.shape({
      setViewMode: PropTypes.func.isRequired,
    }).isRequired,
    textColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.toggleViewMode = this.toggleViewMode.bind(this)
  }

  toggleViewMode() {
    if (this.props.viewMode === 'presentation') {
      this.props.actions.setViewMode('editor')
    } else if (this.props.viewMode === 'editor') {
      this.props.actions.setViewMode('presentation')
    }
  }

  render() {
    let buttonString
    if (this.props.viewMode === 'presentation') {
      buttonString = 'Edit'
    } else if (this.props.viewMode === 'editor') {
      buttonString = 'View'
    }
    return (
      <FlatButton style={{ color: this.props.textColor || '#fafafa' }} onClick={this.toggleViewMode} hoverColor={this.props.hoverColor || 'darkgray'} label={buttonString} />
    )
  }
}


function mapStateToProps(state) {
  return {
    mode: state.mode,
    viewMode: state.viewMode,
    title: state.title,
    declaredVariables: state.userDefinedVariables,
    sidePaneMode: state.sidePaneMode,
    lastSaved: state.lastSaved,
    history: state.history,
    currentTitle: state.title,
    cellIdList: state.cells.map(c => c.id),
    cellTypeList: state.cells.map(c => c.cellType),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}
const NotebookHeaderConnected = connect(mapStateToProps, mapDispatchToProps)(NotebookHeader)
export { NotebookHeaderConnected as NotebookHeader }
// export {NotebookHeader}
