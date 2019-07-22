import React, { useState } from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import format from "date-fns/format";
import CircularProgress from "@material-ui/core/CircularProgress";

import DeleteModal from "../../../../../server/components/delete-modal";
import {
  deleteFileSource as deleteFileSourceAction,
  createFileUpdateOperation as createFileUpdateOperationAction
} from "../../../../actions/file-source-actions";

import {
  TextButton,
  OutlineButton
} from "../../../../../shared/components/buttons";

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
  white-space: nowrap;
`;

const ClickRunNowToFetch = styled.div`
  color: #999;
  font-size: 10px;
  font-style: italic;
  align-self: end;
`;

const FileName = styled.div`
  font-weight: bold;
  color: ${({ hasBeenRun }) => (hasBeenRun ? "black" : "#888")};
`;

const FileSourceURL = styled(ListSecondaryTextLink)`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileInformationContainer = styled.div`
  max-width: 500px;
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 10px;
`;

const ListItemCall = styled(ListMetadata)`
  min-width: 100px;
  text-align: center;
  position: relative;
  height: 100%;
  display: grid;
  margin: auto;
  align-content: center;
  overflow: hidden;
  cursor: pointer;
`;

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

const LastRanLabel = styled.div`
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 12px;
  color: gray;
`;

const operationStatusColors = {
  pending: "MediumSeaGreen",
  running: "MediumSeaGreen",
  completed: "CornflowerBlue",
  failed: "Salmon"
};

const StatusLabel = styled.div`
  margin: auto;
  font-size: 10px;
  color: white;
  padding: 0;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 3px;
  background-color: ${({ status }) => operationStatusColors[status]};
`;

const FileSourceListUnconnected = ({
  fileSources,
  deleteFileSource,
  createFileUpdateOperation
}) => {
  // we will handle the delete modal state in a hook.
  const [sourceToDelete, setSourceToDelete] = useState(undefined);

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
            const isManuallyRunning = ["pending", "running"].includes(
              fileSource.lastFileUpdateOperationStatus
            );
            return (
              <ListItem type="single" key={fileSource.fileSourceID}>
                <ListMain>
                  <ListPrimaryText>
                    <FileInformationContainer>
                      <FileName
                        hasBeenRun={
                          fileSource.lastFileUpdateOperationID !== undefined
                        }
                      >
                        {fileSource.destinationFilename}
                      </FileName>
                      {fileSource.lastFileUpdateOperationID !== undefined ? (
                        <StatusLabel
                          status={fileSource.lastFileUpdateOperationStatus}
                        >
                          {fileSource.lastFileUpdateOperationStatus}
                        </StatusLabel>
                      ) : (
                        <ClickRunNowToFetch>
                          click &quot;run now&quot; to fetch, or wait for
                          scheduler
                        </ClickRunNowToFetch>
                      )}
                      {fileSource.lastRan && (
                        <LastRanLabel>
                          on {formatDate(fileSource.lastRan)}
                        </LastRanLabel>
                      )}
                    </FileInformationContainer>
                  </ListPrimaryText>
                  <FileSourceURLContainer
                    length={fileSource.sourceURL.length}
                    href={fileSource.sourceURL}
                  >
                    <FileSourceURL href={fileSource.sourceURL}>
                      {fileSource.sourceURL}
                    </FileSourceURL>
                  </FileSourceURLContainer>
                </ListMain>
                <FileSourceInterval>
                  {fileSource.updateInterval}
                </FileSourceInterval>
                <ListItemCall>
                  <Fader active={isManuallyRunning}>
                    <CircularProgress size={20} />
                  </Fader>
                  <Fader active={!isManuallyRunning}>
                    <OutlineButton
                      disabled={isManuallyRunning}
                      onClick={() => {
                        createFileUpdateOperation(fileSource.fileSourceID);
                      }}
                    >
                      run now
                    </OutlineButton>
                  </Fader>
                </ListItemCall>

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
  createFileUpdateOperation: PropTypes.func
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
      dispatch(createFileUpdateOperationAction(fileSourceID))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileSourceListUnconnected);
