import React from 'react'
import PropTypes from 'prop-types';

import AddButton from 'material-ui/svg-icons/content/add'
import UpArrow from 'material-ui/svg-icons/navigation/arrow-upward'
import DownArrow from 'material-ui/svg-icons/navigation/arrow-downward'
import PlayButton from 'material-ui/svg-icons/av/play-arrow'
import FastForward from 'material-ui/svg-icons/av/fast-forward'
import { ToolbarGroup } from 'material-ui/Toolbar'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import EditorToolbarMenu from './editor-toolbar-menu'
import NotebookTaskButton from './notebook-task-button'

import tasks from '../../task-definitions'


export default class EditorModeControls extends React.Component {
  static propTypes = {
    firstChild: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      isDeleteNotebookDialogOpen: false,
    }
    this.switchDeleteNotebookDialog = this.switchDeleteNotebookDialog.bind(this)
    this.closeDialogAndDeleteNotebook = this.closeDialogAndDeleteNotebook.bind(this)
  }

  switchDeleteNotebookDialog() {
    this.setState({
      isDeleteNotebookDialogOpen: !this.state.isDeleteNotebookDialogOpen,
    })
  }

  closeDialogAndDeleteNotebook() {
    this.setState({
      isDeleteNotebookDialogOpen: !this.state.isDeleteNotebookDialogOpen,
    })
    this.props.actions.deleteNotebook(this.props.title)
  }

  deleteNotebook() {
    this.switchDeleteNotebookDialog()
  }

  render() {
    const deleteNotebookDialogOptions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.switchDeleteNotebookDialog}
      />,
      <FlatButton
        label="Delete"
        primary
        onClick={this.closeDialogAndDeleteNotebook}
      />,
    ];

    return (
      <ToolbarGroup firstChild={this.props.firstChild}>
        <Dialog
          open={this.state.isDeleteNotebookDialogOpen}
          actions={deleteNotebookDialogOptions}
        >
          Delete Notebook?
        </Dialog>

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

      </ToolbarGroup>
    )
  }
}
