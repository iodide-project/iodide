import React, { useState } from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import DeleteModal from "../../../../server/components/delete-modal";
import { deleteFileSource as deleteFileSourceAction } from "../../../actions/file-source-actions";
import { TextButton } from "../../../../shared/components/buttons";

import {
  List,
  ListItem,
  ListMain,
  ListPrimaryText,
  ListSecondaryText,
  ListSecondaryTextLink,
  ListMetadata
} from "../../../../server/components/list";

const FileSourceListContainer = styled.div`
  width: 100%;
  margin: auto;
`;

const FileSourceInterval = styled(ListMetadata)`
  font-size: 12px;
  color: gray;
`;

const NoFileSourcesNotice = styled.span`
  align-items: center;
  color: #666;
  display: grid;
  font-size: 1.5em;
  font-weight: bold;
  height: 100%;
  text-align: center;
`;

const FileSourceListUnconnected = ({ fileSources, deleteFileSource }) => {
  // Delete modal requirements
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
            return (
              <ListItem type="single" key={fileSource.fileSourceID}>
                <ListMain>
                  <ListPrimaryText>
                    {fileSource.destinationFilename}
                  </ListPrimaryText>
                  <ListSecondaryText href={fileSource.sourceURL}>
                    <ListSecondaryTextLink href={fileSource.sourceURL}>
                      {fileSource.sourceURL}
                    </ListSecondaryTextLink>
                  </ListSecondaryText>
                </ListMain>
                <FileSourceInterval>
                  {fileSource.updateInterval}
                </FileSourceInterval>
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
  deleteFileSource: PropTypes.func
};

function mapStateToProps(state) {
  return {
    fileSources: state.notebookInfo.fileSources
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFileSource: fileSourceID =>
      dispatch(deleteFileSourceAction(fileSourceID))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileSourceListUnconnected);
