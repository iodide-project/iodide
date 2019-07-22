import React, { useState } from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import format from "date-fns/format";

import DeleteModal from "../../../../../server/components/delete-modal";
import {
  deleteFileSource as deleteFileSourceAction,
  createFileUpdateOperation as createFileUpdateOperationAction,
  pollForFileUpdateOperationStatus as pollForFileUpdateOperationStatusAction
} from "../../../../actions/file-source-actions";

import { TextButton } from "../../../../../shared/components/buttons";

import {
  List,
  ListItem,
  ListMain,
  ListPrimaryText,
  ListSecondaryText,
  ListSecondaryTextLink,
  ListMetadata
} from "../../../../../server/components/list";

const formatDate = str => format(new Date(str), "MMM dd, uuuu HH:mm:ss");

const FileSourceListContainer = styled.div`
  width: 100%;
  margin: auto;
`;

const FileSourceInterval = styled(ListMetadata)`
  font-size: 12px;
  color: gray;
  padding-left: 6px;
  padding-right: 6px;
  margin-left: 4px;
  margin-right: 4px;
`;

const NoFileSourcesNotice = styled.span`
  align-items: center;
  color: #666;
  display: grid;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
`;

const FileSourceURLContainer = styled(ListSecondaryText)`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
`;

const FileSourceURL = styled(ListSecondaryTextLink)`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileInformationContainer = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 10px;
`;

const FileSourceListUnconnected = ({
  fileSources,
  deleteFileSource,
  createFileUpdateOperation,
  pollForFileUpdateOperationStatus
}) => {
  // delete modal state
  const [sourceToDelete, setSourceToDelete] = useState(undefined);
  // maintain list of manually-running file operations.
  const [manuallyRunning, setManuallyRunning] = useState([]);

  return fileSources.length ? (
    <React.Fragment>
      <DeleteModal
        visible={sourceToDelete !== undefined}
        title="Delete this file source?"
        onCloseOrCancel={() => setSourceToDelete(undefined)}
        deleteFunction={() => deleteFileSource(sourceToDelete.fileSourceID)}
        onDelete={() => setSourceToDelete(undefined)}
        aboveOtherModals
      />
      <FileSourceListContainer>
        <List>
          {fileSources.map(fileSource => {
            const isManuallyRunning = manuallyRunning.includes(
              fileSource.fileSourceID
            );
            return (
              <ListItem type="single" key={fileSource.fileSourceID}>
                <ListMain>
                  <ListPrimaryText>
                    <FileInformationContainer>
                      <div>{fileSource.destinationFilename}</div>
                      {fileSource.lastRan && (
                        <div>last ran: {fileSource.lastRan}</div>
                      )}
                      {fileSource.lastFileUpdateOperationStatus && (
                        <div>({fileSource.lastFileUpdateOperationStatus})</div>
                      )}
                    </FileInformationContainer>
                  </ListPrimaryText>
                  <FileSourceURLContainer href={fileSource.sourceURL}>
                    <FileSourceURL href={fileSource.sourceURL}>
                      {fileSource.sourceURL}
                    </FileSourceURL>
                  </FileSourceURLContainer>
                </ListMain>
                <FileSourceInterval>
                  {fileSource.updateInterval}
                </FileSourceInterval>
                {isManuallyRunning ? (
                  <ListMetadata>RUNNING</ListMetadata>
                ) : (
                  <ListMetadata
                    onClick={() => {
                      createFileUpdateOperation(fileSource.fileSourceID);
                      setManuallyRunning([
                        ...manuallyRunning,
                        fileSource.fileSourceID
                      ]);
                    }}
                  >
                    <TextButton>run now</TextButton>
                  </ListMetadata>
                )}
                <ListMetadata>
                  <TextButton onClick={() => setSourceToDelete(fileSource)}>
                    delete
                  </TextButton>
                </ListMetadata>
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
  deleteFileSource: PropTypes.func,
  createFileUpdateOperation: PropTypes.func,
  pollForFileUpdateOperationStatus: PropTypes.func
};

function mapStateToProps(state) {
  return {
    fileSources: state.notebookInfo.fileSources
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFileSource: fileSourceID =>
      dispatch(deleteFileSourceAction(fileSourceID)),
    createFileUpdateOperation: fileSourceID =>
      dispatch(createFileUpdateOperationAction(fileSourceID)),
    pollForFileUpdateOperationStatus: fileUpdateOperationID =>
      dispatch(pollForFileUpdateOperationStatusAction(fileUpdateOperationID))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileSourceListUnconnected);
