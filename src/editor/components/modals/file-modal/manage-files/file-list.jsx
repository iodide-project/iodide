import React from "react";
import PropTypes from "prop-types";

import { List } from "../../../../../shared/components/list";
import FileListItem from "./file-list-item";
import { fileShape } from "./propShapes";

export default class extends React.Component {
  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.shape(fileShape)).isRequired,
    confirmDelete: PropTypes.func.isRequired
  };

  /**
   * Get the results of Object.entries(), sorted by filename.
   */
  getSortedFileEntries = () =>
    this.props.files.sort((a, b) => {
      return a.filename.localeCompare(b.filename, undefined, {
        numeric: true
      });
    });

  render() {
    const sortedFileEntries = this.getSortedFileEntries(this.props.files);
    return (
      <List>
        {sortedFileEntries.map(file => (
          <FileListItem
            key={file.filename}
            firstVisible={file.filename === sortedFileEntries[0].filename}
            lastVisible={file.filename === sortedFileEntries.slice(-1).filename}
            file={file}
            confirmDelete={this.props.confirmDelete}
          />
        ))}
      </List>
    );
  }
}
