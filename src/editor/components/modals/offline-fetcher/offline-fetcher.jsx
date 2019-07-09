import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "react-emotion";

import { deleteFileSource as deleteFileSourceAction } from "../../../actions/file-source-actions";

import AddNewFileSource from "./add-new-file-source";
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

const FileSourceContainer = styled.div`
  --marg: 20px;
  padding: var(--marg);
`;

const FileSourceListContainer = styled.div`
  width: 100%;
  margin: auto;
`;

export function OfflineFetcherUnconnected({ fileSources, deleteFileSource }) {
  return (
    <FileSourceContainer>
      <AddNewFileSource />
      <FileSourceListContainer>
        <List>
          {fileSources.map(fileSource => {
            console.log(fileSource.fileSourceID);
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
                <ListMetadata>{fileSource.frequency}</ListMetadata>
                <ListMetadata>
                  <TextButton
                    onClick={() => deleteFileSource(fileSource.fileSourceID)}
                  >
                    delete
                  </TextButton>
                </ListMetadata>
              </ListItem>
            );
          })}
        </List>
      </FileSourceListContainer>
    </FileSourceContainer>
  );
}

OfflineFetcherUnconnected.propTypes = {
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
)(OfflineFetcherUnconnected);
