import PropTypes from "prop-types";
import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import styled from "react-emotion";

const DiffContainer = styled("div")`
  overflow: auto;
`;

export class RevisionDiff extends React.Component {
  static propTypes = {
    gettingRevisionContent: PropTypes.bool,
    currentRevisionContent: PropTypes.string,
    previousRevisionContent: PropTypes.string
  };

  render() {
    if (
      this.props.gettingRevisionContent ||
      this.props.previousRevisionContent === undefined ||
      this.props.currentRevisionContent === undefined
    ) {
      return <p>Getting revisions...</p>;
    } else if (
      this.props.previousRevisionContent.localeCompare(
        this.props.currentRevisionContent
      ) === 0
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
