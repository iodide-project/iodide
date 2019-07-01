import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "react-emotion";
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
  padding-top: var(--marg);
  padding-bottom: var(--marg);
`;

export function OfflineFetcherUnconnected({ fileSources }) {
  return (
    <FileSourceContainer>
      <AddNewFileSource />
      <List>
        {fileSources.map(fileSource => {
          return (
            <ListItem type="single">
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
                <TextButton onClick={() => console.log("delete", fileSource)}>
                  delete
                </TextButton>
              </ListMetadata>
            </ListItem>
          );
        })}
      </List>
    </FileSourceContainer>
  );
}

OfflineFetcherUnconnected.propTypes = {
  fileSources: PropTypes.arrayOf(PropTypes.object)
};

function mapStateToProps(state) {
  return {
    fileSources: state.notebookInfo.fileSources
  };
}

export default connect(mapStateToProps)(OfflineFetcherUnconnected);
