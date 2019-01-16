import React from "react";
import styled from "react-emotion";

import PlayButton from "@material-ui/icons/PlayArrow";
import FastForward from "@material-ui/icons/FastForward";

import EditorToolbarMenu from "./editor-toolbar-menu";
import NotebookTaskButton from "./notebook-task-button";

import tasks from "../../actions/task-definitions";

// the min-width of 300px keeps the title bar centered.
// this should be fixed by someone so the
// title bar stays dead-center, but the left and right
// containers take up the same amount of space.
const EditorModeControlsContainer = styled("div")``;

export default class EditorModeControls extends React.Component {
  render() {
    return (
      <EditorModeControlsContainer>
        <EditorToolbarMenu />
        <NotebookTaskButton task={tasks.evaluateChunkAndSelectBelow}>
          <PlayButton />
        </NotebookTaskButton>
        <NotebookTaskButton task={tasks.evaluateNotebook}>
          <FastForward />
        </NotebookTaskButton>
      </EditorModeControlsContainer>
    );
  }
}
