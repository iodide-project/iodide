import React from 'react'

import PlayButton from '@material-ui/icons/PlayArrow'
import FastForward from '@material-ui/icons/FastForward'

import EditorToolbarMenu from './editor-toolbar-menu'
import NotebookTaskButton from './notebook-task-button'

import tasks from '../../actions/task-definitions'

export default class EditorModeControls extends React.Component {
  render() {
    return (
      <div className="editor-mode-controls" >
        <EditorToolbarMenu />

        <NotebookTaskButton task={tasks.evaluateCell}>
          <PlayButton />
        </NotebookTaskButton>
        <NotebookTaskButton task={tasks.evaluateNotebook}>
          <FastForward />
        </NotebookTaskButton>
      </div>
    )
  }
}
