import React from 'react'

import AddButton from 'material-ui-icons/Add'
import UpArrow from 'material-ui-icons/ArrowUpward'
import DownArrow from 'material-ui-icons/ArrowDownward'
import PlayButton from 'material-ui-icons/PlayArrow'
import FastForward from 'material-ui-icons/FastForward'

import EditorToolbarMenu from './editor-toolbar-menu'
import NotebookTaskButton from './notebook-task-button'

import tasks from '../../actions/task-definitions'

export default class EditorModeControls extends React.Component {
  render() {
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
      </div>
    )
  }
}
