import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import format from "date-fns/format";

import {
  ListMain,
  ListPrimaryText,
  ListSecondaryText,
  ListSecondaryTextLink
} from "../../../../../shared/components/list";

const formatDate = str => format(new Date(str), "MMM dd, uuuu HH:mm:ss");

const operationStatusColors = {
  pending: "MediumSeaGreen",
  running: "MediumSeaGreen",
  completed: "CornflowerBlue",
  failed: "Salmon"
};

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
  max-width: 400px;
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 10px;
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
  background-color: ${({ status }) => operationStatusColors[status]};
`;

const FileSourceListDescription = ({
  url,
  filename,
  latestFileUpdateOperationStatus,
  lastUpdated,
  hasBeenRun
}) => {
  return (
    <ListMain>
      <ListPrimaryText>
        <FileInformationContainer>
          <FileName hasBeenRun={hasBeenRun}>{filename}</FileName>
          {hasBeenRun ? (
            <StatusLabel status={latestFileUpdateOperationStatus}>
              {latestFileUpdateOperationStatus}
            </StatusLabel>
          ) : (
            <ClickRunNowToFetch>
              click &quot;run now&quot; to fetch, or wait for scheduler
            </ClickRunNowToFetch>
          )}
          {lastUpdated && (
            <LastRanLabel>on {formatDate(lastUpdated)}</LastRanLabel>
          )}
        </FileInformationContainer>
      </ListPrimaryText>
      <FileSourceURLContainer href={url}>
        <FileSourceURL href={url}>{url}</FileSourceURL>
      </FileSourceURLContainer>
    </ListMain>
  );
};

FileSourceListDescription.propTypes = {
  url: PropTypes.string,
  filename: PropTypes.string,
  latestFileUpdateOperationStatus: PropTypes.string,
  lastUpdated: PropTypes.string,
  hasBeenRun: PropTypes.bool
};

export default FileSourceListDescription;
