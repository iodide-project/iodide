import PropTypes from "prop-types";
import React from "react";
import styled from "@emotion/styled";
import { connect } from "react-redux";

import Fab from "@material-ui/core/Fab";

import RestoreModal from "./restore-modal";
import { RevisionDiffContent } from "./revision-diff-content";

import { restoreSelectedRevision } from "../../actions/history-modal-actions";

import { getPreviousRevisionId } from "../../tools/revision-history";

import THEME from "../../../shared/theme";

const DiffContainer = styled("div")`
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

class RevisionDiffUnconnected extends React.Component {
  static propTypes = {
    currentRevisionContent: PropTypes.string,
    previousRevisionContent: PropTypes.string,
    revisionContentFetchStatus: PropTypes.string.isRequired,
    canRestore: PropTypes.bool,
    restoreSelectedRevision: PropTypes.func.isRequired,
    selectedRevision: PropTypes.shape({
      created: PropTypes.string,
      id: PropTypes.number
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      pendingRestore: false
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
        <RestoreModal
          visible={this.state.pendingRestore !== false}
          onCloseOrCancel={() => {
            this.setState({ pendingRestore: false });
          }}
          onRestore={() => {
            this.props.restoreSelectedRevision();
          }}
          date={
            this.props.selectedRevision
              ? this.props.selectedRevision.created
              : undefined
          }
        />
        <RevisionDiffContent
          original={this.props.previousRevisionContent}
          modified={this.props.currentRevisionContent}
        />
        {this.props.canRestore && (
          <Fab
            onClick={() => {
              this.setState({ pendingRestore: true });
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
            Restore this revision
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
  let selectedRevision;
  if (selectedRevisionId !== undefined && revisionContent) {
    selectedRevision = revisionList.find(r => r.id === selectedRevisionId);
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
    canRestore:
      selectedRevisionId !== undefined &&
      state.iomd !== currentRevisionContent &&
      revisionContentFetchStatus === "IDLE",
    selectedRevision
  };
}

export default connect(
  mapStateToProps,
  { restoreSelectedRevision } // mapDispatchToProps shorthand
)(RevisionDiffUnconnected);
