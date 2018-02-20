import React from 'react'
import PropTypes from 'prop-types'

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'

import IconButton from 'material-ui/IconButton'
import HistoryIcon from 'material-ui/svg-icons/action/history'
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import MainMenu from './menu-component'
import ViewModeToggleButton from './view-mode-toggle-button'

import Title from './title'

import { prettyDate } from '../notebook-utils'


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

export default EditorMenu
