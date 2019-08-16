import React, { useEffect, useState } from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import FileSourceListItem from "./file-source-list-item";

import DeleteModal from "../../../../../shared/components/delete-modal";

import { List } from "../../../../../shared/components/list";

import {
  deleteFileSource as deleteFileSourceAction,
  getFileSources as getFileSourcesAction
} from "../../../../actions/file-source-actions";

import { DELETE_ANIMATION_LENGTH_MS } from "../shared/constants";

// FIXME: make sure this applies to 'manage files' as well.

const FileSourceListContainer = styled.div`
  width: 100%;
  margin: auto;
`;

const NoFileSourcesNotice = styled.span`
  align-items: center;
  color: #666;
  display: grid;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
`;

const FileSourceListUnconnected = ({
  fileSources = [],
  getFileSources,
  deleteFileSource
}) => {
  // we will handle the delete modal state in a hook.
  // otherwise, the state for the file sources is managed in the
  // store itself.
  const [sourceToDelete, setSourceToDelete] = useState(undefined);
  const [sourceToDeleteFileName, setSourceToDeleteFileName] = useState(
    undefined
  );
  // we will use this to animate the unmount of a deleted component.
  const [hideSourceToDeleteFirst, setHideSourceToDeleteFirst] = useState(
    undefined
  );

  const clearSourceToDelete = () => {
    setSourceToDelete(undefined);
    setSourceToDeleteFileName(undefined);
  };

  useEffect(() => {
    getFileSources();
  }, []);

  return fileSources.length ? (
    <React.Fragment>
      <DeleteModal
        visible={sourceToDelete !== undefined}
        title={`Delete the file source for "${sourceToDeleteFileName}"?`}
        content="This action will not delete any files downloaded by the file source."
        onCloseOrCancel={clearSourceToDelete}
        deleteFunction={() => {
          setHideSourceToDeleteFirst(sourceToDelete);
          setTimeout(() => {
            deleteFileSource(sourceToDelete);
          }, DELETE_ANIMATION_LENGTH_MS);
        }}
        onDelete={clearSourceToDelete}
        aboveOtherModals
      />
      <FileSourceListContainer>
        <List>
          {fileSources.map(({ id, filename }) => {
            return (
              <FileSourceListItem
                key={id}
                id={id}
                isDeleting={hideSourceToDeleteFirst === id}
                onDeleteFileSource={() => {
                  setSourceToDelete(id);
                  setSourceToDeleteFileName(filename);
                }}
              />
            );
          })}
        </List>
      </FileSourceListContainer>
    </React.Fragment>
  ) : (
    <NoFileSourcesNotice>
      No file sources are associated with this notebook
    </NoFileSourcesNotice>
  );
};

FileSourceListUnconnected.propTypes = {
  fileSources: PropTypes.arrayOf(PropTypes.object),
  getFileSources: PropTypes.func,
  deleteFileSource: PropTypes.func
};

export function mapStateToProps(state) {
  return {
    fileSources: state.fileSources.sources.map(({ id, filename }) => {
      return {
        id,
        filename
      };
    })
  };
}

export default connect(
  mapStateToProps,
  {
    deleteFileSource: deleteFileSourceAction,
    getFileSources: getFileSourcesAction
  }
)(FileSourceListUnconnected);
