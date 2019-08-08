import React from "react";
import PropTypes from "prop-types";

import { List } from "../../../../../shared/components/list";
import FileListItem from "./file-list-item";
import { fileShape } from "./propShapes";

export default class extends React.Component {
  static propTypes = {
    files: PropTypes.objectOf(PropTypes.shape(fileShape)).isRequired,
    confirmDelete: PropTypes.func.isRequired
  };

  /**
   * Get the results of Object.entries(), sorted by filename.
   */
  getSortedFileEntries = () =>
    Object.entries(this.props.files).sort((a, b) => {
      return a[1].name.localeCompare(b[1].name, undefined, {
        numeric: true
      });
    });

  getFirstVisibleFileKey = fileEntries => {
    const visibleStatuses = ["uploading", "error", "saved"];
    const file = fileEntries.find(tuple => {
      return visibleStatuses.includes(tuple[1].status);
    });

    if (file) return file[0];
    return undefined;
  };

  getLastVisibleFileKey = fileEntries => {
    return this.getFirstVisibleFileKey(
      fileEntries
        .map(tuple => {
          // getFirstVisibleFileKey only checks the status. There's no sense in
          // keeping everything else when we reverse the array.
          return [tuple[0], { status: tuple[1].status }];
        })
        .reverse()
    );
  };

  render() {
    const sortedFileEntries = this.getSortedFileEntries(this.props.files);
    const firstVisibleFileKey = this.getFirstVisibleFileKey(sortedFileEntries);
    const lastVisibleFileKey = this.getLastVisibleFileKey(sortedFileEntries);

    return (
      <List>
        {sortedFileEntries.map(([fileKey, file]) => (
          <FileListItem
            key={fileKey}
            firstVisible={fileKey === firstVisibleFileKey}
            lastVisible={fileKey === lastVisibleFileKey}
            fileKey={fileKey}
            file={file}
            confirmDelete={this.props.confirmDelete}
          />
        ))}
      </List>
    );
  }
}
