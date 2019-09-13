import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import {
  ListMain,
  ListPrimaryText,
  ListSecondaryText,
  ListSecondaryTextLink
} from "../../../../../shared/components/list";

const operationStatusColors = {
  pending: "MediumSeaGreen",
  running: "MediumSeaGreen",
  completed: "CornflowerBlue",
  failed: "Salmon"
};

const FileSourceListItemDescriptionContainer = styled(ListMain)`
  padding-right: 10px;
`;

const FileSourceURLContainer = styled(ListSecondaryText)`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 400px;
  white-space: nowrap;

  @media (max-width: 1200px) {
    width: 300px;
  }
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
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 10px;
  align-items: baseline;
`;

const LastRanLabel = styled.div`
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 12px;
  color: gray;
`;

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
  align-self: end;
  background-color: ${({ status }) => operationStatusColors[status]};
`;

const FileUpdateOperationHelperText = styled.div`
  font-size: 11px;
  font-style: italic;
  color: ${({ error }) => (error ? operationStatusColors.failed : "gray")};
  text-overflow: ellipsis;
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  height: ${({ collapsed }) => (collapsed ? "0px" : "100%")};
  transition: height 200s;

  @media (max-width: 1200px) {
    width: 300px;
  }
`;

const FileSourceListDescription = ({
  url,
  filename,
  latestFileUpdateOperationStatus,
  lastUpdated,
  hasBeenRun,
  failureReason,
  showFailureReason = false
}) => {
  return (
    <FileSourceListItemDescriptionContainer>
      <ListPrimaryText>
        <FileInformationContainer>
          <FileName hasBeenRun={hasBeenRun}>{filename}</FileName>

          {hasBeenRun && (
            <StatusLabel status={latestFileUpdateOperationStatus}>
              {latestFileUpdateOperationStatus}
            </StatusLabel>
          )}

          {lastUpdated && <LastRanLabel>on {lastUpdated}</LastRanLabel>}
        </FileInformationContainer>
      </ListPrimaryText>
      <FileSourceURLContainer href={url}>
        <FileSourceURL href={url}>{url}</FileSourceURL>
      </FileSourceURLContainer>
      <FileUpdateOperationHelperText
        error={showFailureReason}
        collapsed={!(showFailureReason || !hasBeenRun)}
        title={failureReason}
      >
        {showFailureReason && failureReason}
        {!hasBeenRun && `click "download now" or wait for scheduler`}
      </FileUpdateOperationHelperText>
    </FileSourceListItemDescriptionContainer>
  );
};

FileSourceListDescription.propTypes = {
  url: PropTypes.string,
  filename: PropTypes.string,
  failureReason: PropTypes.string,
  showFailureReason: PropTypes.bool,
  latestFileUpdateOperationStatus: PropTypes.string,
  lastUpdated: PropTypes.string,
  hasBeenRun: PropTypes.bool
};

export default FileSourceListDescription;
