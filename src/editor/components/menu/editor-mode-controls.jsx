import React from "react";

import PlayButton from "@material-ui/icons/PlayArrow";
import FastForward from "@material-ui/icons/FastForward";

import EditorToolbarMenu from "./editor-toolbar-menu";
import NotebookTaskButton from "./notebook-task-button";

import tasks from "../../user-tasks/task-definitions";

export default class EditorModeControls extends React.Component {
  render() {
    return (
      <React.Fragment>
        <EditorToolbarMenu />
        <NotebookTaskButton task={tasks.evaluateChunkAndSelectBelow}>
          <PlayButton />
        </NotebookTaskButton>
        <NotebookTaskButton task={tasks.evaluateNotebook}>
          <FastForward />
        </NotebookTaskButton>
      </React.Fragment>
    );
  }
}
