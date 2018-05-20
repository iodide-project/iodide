import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import AddButton from 'material-ui-icons/Add'
import UpArrow from 'material-ui-icons/ArrowUpward'
import DownArrow from 'material-ui-icons/ArrowDownward'
import PlayButton from 'material-ui-icons/PlayArrow'
import FastForward from 'material-ui-icons/FastForward'
import AccountCircle from 'material-ui-icons/AccountCircle'
import ExitToApp from 'material-ui-icons/ExitToApp'
import ImportExport from 'material-ui-icons/ImportExport'

import EditorToolbarMenu from './editor-toolbar-menu'
import NotebookTaskButton from './notebook-task-button'

import tasks from '../../actions/task-definitions'

export class EditorModeControlsUnconnected extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    const loginItem = this.props.isAuthenticated ?
      (
        <React.Fragment>
          <NotebookTaskButton task={tasks.exportGist}>
            <ImportExport />
          </NotebookTaskButton>
          <NotebookTaskButton task={tasks.logoutGithub}>
            <ExitToApp />
          </NotebookTaskButton>
        </React.Fragment>
      )
      :
      (
        <NotebookTaskButton task={tasks.loginGithub}>
          <AccountCircle />
        </NotebookTaskButton>
      )

    return (
      <div className="editor-mode-controls" >
        <EditorToolbarMenu />
        <NotebookTaskButton task={tasks.addCellBelow}>
          <AddButton />
        </NotebookTaskButton>
        <NotebookTaskButton task={tasks.moveCellUp}>
          <UpArrow />
        </NotebookTaskButton>
        <NotebookTaskButton task={tasks.moveCellDown}>
          <DownArrow />
        </NotebookTaskButton>
        <NotebookTaskButton task={tasks.evaluateCell}>
          <PlayButton />
        </NotebookTaskButton>
        <NotebookTaskButton task={tasks.evaluateAllCells}>
          <FastForward />
        </NotebookTaskButton>
        {loginItem}
      </div>
    )
  }
}

export function mapStateToProps(state) {
  const isAuthenticated = Boolean(state.authToken)
  return { isAuthenticated }
}

export default connect(mapStateToProps)(EditorModeControlsUnconnected)
