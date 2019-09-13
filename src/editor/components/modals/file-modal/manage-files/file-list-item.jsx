import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "@emotion/styled";

import { TextButton } from "../../../../../shared/components/buttons";
import {
  ListItem,
  LIST_BORDER,
  LIST_BORDER_RADIUS
} from "../../../../../shared/components/list";
import THEME from "../../../../../shared/theme";
import { fileShape } from "./propShapes";
import { defaultSpacing } from "./styles";

const circularProgressSize = "20px";

const FileListItem = styled(ListItem)`
  align-content: center;
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${defaultSpacing};
  justify-content: space-between;
  min-height: ${circularProgressSize};

  &.error {
    background-color: #f4cccc;
  }

  &.deleted {
    border: 0;
    height: 0;
    min-height: 0;
    opacity: 0;
    padding-bottom: 0;
    padding-top: 0;
    transform: scaleY(0);

    transition: border 500ms, height 500ms, min-height 500ms, opacity 500ms,
      padding-bottom 500ms, padding-top 500ms, transform 500ms;
  }

  /* Give the first and last visible list items rounded borders even if they are
     not the first and last items in the DOM. Deleted items are kept in the DOM
     because we want to see them fade out and CSS transitions cannot be applied
     to elements that are removed from the DOM or set to "display: none". */
  &.first-visible {
    border-top: ${LIST_BORDER};
    border-top-right-radius: ${LIST_BORDER_RADIUS};
    border-top-left-radius: ${LIST_BORDER_RADIUS};
  }
  &.last-visible {
    border-bottom: ${LIST_BORDER};
    border-bottom-right-radius: ${LIST_BORDER_RADIUS};
    border-bottom-left-radius: ${LIST_BORDER_RADIUS};
  }
`;

const FilenameLink = styled.a`
  color: #000;
  font-weight: bold;
  text-decoration: none;

  /* Show as much of the filename as possible without encroaching on the file
     action buttons */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Filename = styled.div`
  color: #000;
  font-weight: bold;

  /* Show as much of the filename as possible without encroaching on the spinner
     or any error messages */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileStatus = styled.div`
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${defaultSpacing};
`;

const FileCircularProgress = styled(CircularProgress)`
  color: ${THEME.button.baseColor};
`;

const FileActions = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${defaultSpacing};
  justify-content: end;
`;

const FileAction = styled(TextButton)`
  margin: 0; /* grid-gap will take care of spacing */
`;

class UploadingContent extends React.Component {
  static propTypes = {
    file: PropTypes.shape(fileShape)
  };

  render = () => (
    <React.Fragment>
      <Filename>{this.props.file.name}</Filename>
      <FileStatus>
        <span>Uploading...</span>
        <FileCircularProgress
          variant="indeterminate"
          size={circularProgressSize}
        />
      </FileStatus>
    </React.Fragment>
  );
}

class ErrorContent extends React.Component {
  static propTypes = {
    file: PropTypes.shape(fileShape).isRequired
  };

  render = () => (
    <React.Fragment>
      <Filename>{this.props.file.name}</Filename>
      <span>{this.props.file.errorMessage}</span>
    </React.Fragment>
  );
}

class SavedOrDeletedContent extends React.Component {
  static propTypes = {
    file: PropTypes.shape(fileShape).isRequired,
    fileKey: PropTypes.string.isRequired,
    confirmDelete: PropTypes.func.isRequired
  };

  render = () => (
    <React.Fragment>
      <FilenameLink
        href={`${window.location.href}files/${this.props.file.name}`}
        target="_blank"
      >
        {this.props.file.name}
      </FilenameLink>
      <FileActions>
        <FileAction
          className="file-action file-action-delete"
          onClick={() => {
            this.props.confirmDelete(
              this.props.file.name,
              this.props.fileKey,
              this.props.file.id
            );
          }}
        >
          delete
        </FileAction>
      </FileActions>
    </React.Fragment>
  );
}

export default class extends React.Component {
  static propTypes = {
    file: PropTypes.shape(fileShape).isRequired,
    fileKey: PropTypes.string.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    firstVisible: PropTypes.bool.isRequired,
    lastVisible: PropTypes.bool.isRequired
  };

  render() {
    const id = this.props.file.id ? `file-${this.props.file.id}` : null;
    let content = null;

    switch (this.props.file.status) {
      case "uploading":
        content = <UploadingContent file={this.props.file} />;
        break;

      case "error":
        content = <ErrorContent file={this.props.file} />;
        break;

      // Deleted files are displayed just like saved files because we want to
      // watch the saved file out and CSS transitions cannot be applied to
      // elements that are removed from the DOM or set to "display: none".
      case "saved":
      case "deleted":
        content = (
          <SavedOrDeletedContent
            fileKey={this.props.fileKey}
            file={this.props.file}
            confirmDelete={this.props.confirmDelete}
          />
        );
        break;

      // no default
    }

    const classes = [this.props.file.status];

    if (this.props.firstVisible) {
      classes.push("first-visible");
    }

    if (this.props.lastVisible) {
      classes.push("last-visible");
    }

    return (
      <FileListItem id={id} className={classes.join(" ")}>
        {content}
      </FileListItem>
    );
  }
}
