import React, { useEffect, useState } from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Delete from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";

import FileSourceListItemDescription from "./file-source-list-item-description";

import DeleteModal from "../../../../../shared/components/delete-modal";

import {
  List,
  ListItem,
  ListMetadata
} from "../../../../../shared/components/list";

import {
  TextButton,
  OutlineButton
} from "../../../../../shared/components/buttons";

import {
  deleteFileSource as deleteFileSourceAction,
  createFileUpdateOperation as createFileUpdateOperationAction,
  getFileSources as getFileSourcesAction
} from "../../../../actions/file-source-actions";

const FILE_SOURCE_DELETE_ANIMATION_LENGTH_MS = 200;

const FileSourceListContainer = styled.div`
  width: 100%;
  margin: auto;

  ${ListItem} {
    transition: height ${FILE_SOURCE_DELETE_ANIMATION_LENGTH_MS}ms,
      padding-top ${FILE_SOURCE_DELETE_ANIMATION_LENGTH_MS}ms,
      padding-bottom ${FILE_SOURCE_DELETE_ANIMATION_LENGTH_MS}ms,
      opacity ${FILE_SOURCE_DELETE_ANIMATION_LENGTH_MS}ms;
    transition-timing-function: ease-out;
  }

  ${ListItem}.disappearing {
    height: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
    overflow: hidden;
    opacity: 0;
  }
`;

const FileSourceInterval = styled(ListMetadata)`
  font-size: 12px;
  color: gray;
  padding-left: 6px;
  padding-right: 6px;
  margin-left: 4px;
  margin-right: 4px;
  text-align: center;
  line-height: 1.1;
  min-width: 100px;
  align-self: center;
`;

const NoFileSourcesNotice = styled.span`
  align-items: center;
  color: #666;
  display: grid;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
`;

const DownloadNowButtonContainer = styled(ListMetadata)`
  text-align: center;
  position: relative;
  height: 100%;
  min-width: 150px;
  display: grid;
  margin: auto;
  align-content: center;
  overflow-y: hidden;
  cursor: pointer;
`;

const DownloadNowButton = styled(OutlineButton)`
  min-width: 150px;
  padding-left: 3px;
  padding-right: 0px;
`;

// FIXME: bring this component into its own file so we can reuse.
// for now, however, it will be more advantageous to not encourage its use elsewhere
// until it is needed.

const Fader = styled.div`
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;
  margin: auto;
  display: grid;
  align-content: center;
  justify-content: center;
  opacity: ${({ active }) => (active ? 1 : 0)};
  transform: ${({ active }) => (!active ? "translateY(-5px)" : "none")};
  transition: opacity 200ms, transform 250ms;
`;

// FIXME: bring this button approach to the files modal

const ListDeleteButtonContainer = styled(ListMetadata)`
  align-self: center;
  display: grid;
  align-content: center;

  button {
    display: grid;
  }
`;

const ListDeleteButton = styled(TextButton)`
  padding: 2px;
  margin-left: 20px;
`;

const FileSourceListUnconnected = ({
  fileSources = [],
  getFileSources,
  deleteFileSource,
  createFileUpdateOperation
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
          }, FILE_SOURCE_DELETE_ANIMATION_LENGTH_MS);
        }}
        onDelete={clearSourceToDelete}
        aboveOtherModals
      />
      <FileSourceListContainer>
        <List>
          {fileSources.map(fileSource => {
            const {
              id,
              url,
              filename,
              latestFileUpdateOperationStatus,
              hasBeenRun,
              updateInterval,
              lastUpdated,
              isCurrentlyRunning,
              failureReason,
              showFailureReason,
              listSize
            } = fileSource;
            return (
              <ListItem
                type={listSize}
                key={id}
                className={
                  hideSourceToDeleteFirst === id ? "disappearing" : undefined
                }
              >
                <FileSourceListItemDescription
                  url={url}
                  filename={filename}
                  latestFileUpdateOperationStatus={
                    latestFileUpdateOperationStatus
                  }
                  lastUpdated={lastUpdated}
                  hasBeenRun={hasBeenRun}
                  failureReason={failureReason}
                  showFailureReason={showFailureReason}
                />
                <FileSourceInterval>{updateInterval}</FileSourceInterval>
                <DownloadNowButtonContainer>
                  <Fader active={isCurrentlyRunning}>
                    <CircularProgress size={20} />
                  </Fader>
                  <Fader active={!isCurrentlyRunning}>
                    <DownloadNowButton
                      disabled={isCurrentlyRunning}
                      onClick={() => {
                        createFileUpdateOperation(id);
                      }}
                    >
                      download now
                    </DownloadNowButton>
                  </Fader>
                </DownloadNowButtonContainer>
                <ListDeleteButtonContainer>
                  <ListDeleteButton
                    onClick={() => {
                      setSourceToDelete(id);
                      setSourceToDeleteFileName(filename);
                    }}
                  >
                    <Delete />
                  </ListDeleteButton>
                </ListDeleteButtonContainer>
              </ListItem>
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
  deleteFileSource: PropTypes.func,
  createFileUpdateOperation: PropTypes.func
};

export function mapStateToProps(state) {
  const fileSources = state.fileSources.map(fileSource => {
    const fileUpdateOperation = fileSource.latest_file_update_operation;
    const hasFileUpdateOperation =
      fileUpdateOperation !== null &&
      Object.getOwnPropertyNames(fileUpdateOperation).length > 0;

    const hasBeenRun =
      hasFileUpdateOperation && fileUpdateOperation.status !== undefined;

    const isCurrentlyRunning =
      hasFileUpdateOperation &&
      ["pending", "running"].includes(fileUpdateOperation.status);

    const latestFileUpdateOperationStatus = hasFileUpdateOperation
      ? fileUpdateOperation.status
      : undefined;

    const lastUpdated = hasFileUpdateOperation
      ? fileUpdateOperation.started
      : undefined;

    const failureReason =
      hasFileUpdateOperation && fileUpdateOperation.failure_reason !== null
        ? fileUpdateOperation.failure_reason
        : undefined;

    const showFailureReason = failureReason !== undefined;

    const listSize = showFailureReason || !hasBeenRun ? "triple" : "single";

    return {
      id: fileSource.id,
      filename: fileSource.filename,
      url: fileSource.url,
      updateInterval: fileSource.update_interval,
      isCurrentlyRunning,
      latestFileUpdateOperationStatus,
      lastUpdated,
      hasBeenRun,
      failureReason,
      showFailureReason,
      listSize
    };
  });
  return {
    fileSources
  };
}

export default connect(
  mapStateToProps,
  {
    deleteFileSource: deleteFileSourceAction,
    createFileUpdateOperation: createFileUpdateOperationAction,
    getFileSources: getFileSourcesAction
  }
)(FileSourceListUnconnected);
