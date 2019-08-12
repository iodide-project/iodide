import PropTypes from "prop-types";
import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import styled from "react-emotion";
import { connect } from "react-redux";

import Fab from "@material-ui/core/Fab";

import ReversionModal from "./reversion-modal";

import { revertToSelectedRevisionId } from "../../actions/history-modal-actions";

import { getPreviousRevisionId } from "../../tools/revision-history";

import THEME from "../../../shared/theme";

const DiffContainer = styled("div")`
  overflow: auto;
`;

class RevisionDiffUnconnected extends React.Component {
  static propTypes = {
    currentRevisionContent: PropTypes.string,
    previousRevisionContent: PropTypes.string,
    revisionContentFetchStatus: PropTypes.string.isRequired,
    canRevert: PropTypes.bool,
    revertToSelectedRevisionId: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      pendingRevert: false
    };
  }

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
        <ReversionModal
          visible={this.state.pendingRevert !== false}
          onCloseOrCancel={() => {
            this.setState({ pendingRevert: false });
          }}
          onRevert={() => {
            this.props.revertToSelectedRevisionId();
          }}
          aboveOtherModals
        />
        <ReactDiffViewer
          oldValue={this.props.previousRevisionContent}
          newValue={this.props.currentRevisionContent}
          splitView={false}
        />
        {this.props.canRevert && (
          <Fab
            onClick={() => {
              this.setState({ pendingRevert: true });
            }}
            variant="extended"
            style={{
              right: 32,
              bottom: 16,
              position: "fixed",
              color: "#fff",
              background: THEME.clientModal.background,
              borderRadius: 8
            }}
          >
            Revert
          </Fab>
        )}
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
    currentRevisionContent = state.iomd;
    previousRevisionContent =
      revisionList.length > 0 ? revisionContent[revisionList[0].id] : "";
  }

  return {
    currentRevisionContent,
    revisionContentFetchStatus,
    previousRevisionContent,
    canRevert:
      selectedRevisionId !== undefined &&
      state.iomd !== currentRevisionContent &&
      revisionContentFetchStatus === "IDLE"
  };
}

export default connect(
  mapStateToProps,
  { revertToSelectedRevisionId } // mapDispatchToProps shorthand
)(RevisionDiffUnconnected);
