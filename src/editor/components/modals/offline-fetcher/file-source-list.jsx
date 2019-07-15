import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
  return fileSources.length ? (
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
