import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { connect } from "react-redux";
import Delete from "@material-ui/icons/Delete";

import { ListItem, ListMetadata } from "../../../../../shared/components/list";

import DeleteModal from "../../../../../shared/components/delete-modal";

import FileSourceListItemDescription from "./file-source-list-item-description";

import InProgress from "./in-progress";

import { timeMonthDayYear } from "../../../../../shared/date-formatters";

import { DELETE_ANIMATION_LENGTH_MS } from "../shared/constants";

import {
  createFileUpdateOperation as createFileUpdateOperationAction,
  deleteFileSource as deleteFileSourceAction,
  setConfirmDeleteID as setConfirmDeleteIDAction,
  setIsDeletingAnimationID as setIsDeletingAnimationIDAction
} from "../../../../actions/file-source-actions";

import {
  TextButton,
  OutlineButton
} from "../../../../../shared/components/buttons";

const FileSourceListItemContainer = styled(ListItem)`
  transition: height ${DELETE_ANIMATION_LENGTH_MS}ms,
    padding-top ${DELETE_ANIMATION_LENGTH_MS}ms,
    padding-bottom ${DELETE_ANIMATION_LENGTH_MS}ms,
    opacity ${DELETE_ANIMATION_LENGTH_MS}ms;
  transition-timing-function: ease-out;

  &.disappearing {
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

const DeleteButtonContainer = styled(ListMetadata)`
  align-self: center;
  display: grid;
  align-content: center;

  button {
    display: grid;
  }
`;

const DeleteButton = styled(TextButton)`
  padding: 2px;
  margin-left: 20px;
`;

export function FileSourceListItemUnconnected({
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
  listSize,
  isDeletingClass,
  deleteFileSource,
  createFileUpdateOperation,
  isConfirmingDelete,
  setConfirmDeleteID,
  setIsDeletingAnimationID
}) {
  return (
    <>
      <DeleteModal
        visible={isConfirmingDelete}
        title={`Delete the file source for "${filename}"?`}
        content="This action will not delete any files downloaded by the file source."
        onCloseOrCancel={() => {
          setConfirmDeleteID(undefined);
        }}
        deleteFunction={() => {
          setIsDeletingAnimationID(id);
          setTimeout(() => {
            deleteFileSource(id);
            setIsDeletingAnimationID(undefined);
          }, DELETE_ANIMATION_LENGTH_MS);
        }}
        onDelete={() => {}}
        aboveOtherModals
      />
      <FileSourceListItemContainer type={listSize} className={isDeletingClass}>
        <FileSourceListItemDescription
          url={url}
          filename={filename}
          latestFileUpdateOperationStatus={latestFileUpdateOperationStatus}
          lastUpdated={lastUpdated}
          hasBeenRun={hasBeenRun}
          failureReason={failureReason}
          showFailureReason={showFailureReason}
        />
        <FileSourceInterval>{updateInterval}</FileSourceInterval>
        <DownloadNowButtonContainer>
          <InProgress spinning={isCurrentlyRunning}>
            <DownloadNowButton
              disabled={isCurrentlyRunning}
              onClick={() => {
                createFileUpdateOperation(id);
              }}
            >
              download now
            </DownloadNowButton>
          </InProgress>
        </DownloadNowButtonContainer>
        <DeleteButtonContainer>
          <DeleteButton onClick={() => setConfirmDeleteID(id)}>
            <Delete />
          </DeleteButton>
        </DeleteButtonContainer>
      </FileSourceListItemContainer>
    </>
  );
}

FileSourceListItemUnconnected.propTypes = {
  id: PropTypes.number,
  url: PropTypes.string,
  filename: PropTypes.string,
  latestFileUpdateOperationStatus: PropTypes.string,
  hasBeenRun: PropTypes.bool,
  updateInterval: PropTypes.string,
  lastUpdated: PropTypes.string,
  isCurrentlyRunning: PropTypes.bool,
  failureReason: PropTypes.string,
  showFailureReason: PropTypes.bool,
  listSize: PropTypes.string,
  isDeletingClass: PropTypes.string,
  isConfirmingDelete: PropTypes.bool,
  deleteFileSource: PropTypes.func,
  createFileUpdateOperation: PropTypes.func,
  setIsDeletingAnimationID: PropTypes.func,
  setConfirmDeleteID: PropTypes.func
};

export function mapStateToProps(state, ownProps) {
  const { isDeletingAnimationID, confirmDeleteID } = state.fileSources;

  const fileSource = state.fileSources.sources.find(
    fs => fs.id === ownProps.id
  );
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
    ? timeMonthDayYear(fileUpdateOperation.started_at)
    : undefined;

  const failureReason =
    hasFileUpdateOperation && fileUpdateOperation.failure_reason !== null
      ? fileUpdateOperation.failure_reason
      : undefined;

  const showFailureReason = failureReason !== undefined;

  const listSize = showFailureReason || !hasBeenRun ? "triple" : "single";

  const isDeletingClass =
    isDeletingAnimationID === fileSource.id ? "disappearing" : undefined;

  const isConfirmingDelete = confirmDeleteID === fileSource.id;

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
    listSize,
    isDeletingClass,
    isConfirmingDelete
  };
}

export default connect(mapStateToProps, {
  setIsDeletingAnimationID: setIsDeletingAnimationIDAction,
  setConfirmDeleteID: setConfirmDeleteIDAction,
  deleteFileSource: deleteFileSourceAction,
  createFileUpdateOperation: createFileUpdateOperationAction
})(FileSourceListItemUnconnected);
