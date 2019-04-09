import PropTypes from "prop-types";
import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import styled from "react-emotion";
import { connect } from "react-redux";

import { getPreviousRevisionId } from "../../tools/revision-history";

const DiffContainer = styled("div")`
  overflow: auto;
`;

class RevisionDiffUnconnected extends React.Component {
  static propTypes = {
    currentRevisionContent: PropTypes.string,
    previousRevisionContent: PropTypes.string,
    revisionContentFetchStatus: PropTypes.string.isRequired
  };

  render() {
    if (this.props.revisionContentFetchStatus === "FETCHING") {
      return <p>Getting revisions...</p>;
    } else if (this.props.revisionContentFetchStatus === "ERROR") {
      return <p>Error getting revision content.</p>;
    } else if (
      this.props.previousRevisionContent === this.props.currentRevisionContent
    ) {
      return <p>No difference.</p>;
    }
    return (
      <DiffContainer>
        <ReactDiffViewer
          oldValue={this.props.previousRevisionContent}
          newValue={this.props.currentRevisionContent}
          splitView={false}
        />
      </DiffContainer>
    );
  }
}

export function mapStateToProps(state) {
  const notebookHistory = state.notebookHistory || {};
  const {
    revisionContentFetchStatus,
    selectedRevisionId,
    revisionContent,
    revisionList
  } = notebookHistory;

  let currentRevisionContent;
  let previousRevisionContent;
  if (selectedRevisionId !== undefined && revisionContent) {
    currentRevisionContent = revisionContent[selectedRevisionId];
    const previousRevisionId = getPreviousRevisionId(
      revisionList,
      selectedRevisionId
    );
    previousRevisionContent = previousRevisionId
      ? revisionContent[previousRevisionId]
      : "";
  } else if (revisionList && revisionContent) {
    // looking at changes (if any) since last save
    currentRevisionContent = state.jsmd;
    previousRevisionContent =
      revisionList.length > 0 ? revisionContent[revisionList[0].id] : "";
  }

  return {
    currentRevisionContent,
    revisionContentFetchStatus,
    previousRevisionContent
  };
}

export default connect(mapStateToProps)(RevisionDiffUnconnected);
