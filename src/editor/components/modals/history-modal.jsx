import PropTypes from "prop-types";
import React from "react";
import styled from "@emotion/styled";
import { connect } from "react-redux";

import { ModalContainer } from "./modal-container";
import TitleBar from "./title-bar";
import RevisionDiff from "./revision-diff";
import RevisionList from "./revision-list";
import { getNotebookRevisionList } from "../../actions/history-modal-actions";

const ModalContentContainer = styled("div")`
  display: grid;
  grid-template-columns: 208px 1fr;
  grid-column-gap: 20px;
  padding: 0px;
  overflow: auto;
  height: 100%;
`;

class HistoryModalUnconnected extends React.Component {
  static propTypes = {
    getNotebookRevisionList: PropTypes.func.isRequired,
    revisionListFetchStatus: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.props.getNotebookRevisionList();
  }

  render() {
    return (
      <ModalContainer style={{ width: "90%" }}>
        <TitleBar title="Notebook History" />
        {(() => {
          switch (this.props.revisionListFetchStatus) {
            case "FETCHING":
              return <p>Getting revisions...</p>;
            case "ERROR":
              return <p>Error getting revisions</p>;
            default:
              return (
                <ModalContentContainer>
                  <RevisionList />
                  <RevisionDiff />
                </ModalContentContainer>
              );
          }
        })()}
      </ModalContainer>
    );
  }
}

export function mapStateToProps(state) {
  const notebookHistory = state.notebookHistory || {};
  const { errorGettingRevisionList, revisionListFetchStatus } = notebookHistory;

  return {
    errorGettingRevisionList,
    revisionListFetchStatus
  };
}

export default connect(
  mapStateToProps,
  { getNotebookRevisionList } // mapDispatchToProps shorthand
)(HistoryModalUnconnected);
