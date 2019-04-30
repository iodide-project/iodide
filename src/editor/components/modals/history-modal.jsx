import PropTypes from "prop-types";
import React from "react";
import styled from "react-emotion";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { ModalContainer } from "./modal-container";
import RevisionDiff from "./revision-diff";
import RevisionList from "./revision-list";
import { getNotebookRevisionList } from "../../actions/actions";
import THEME from "../../../shared/theme";

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
        <AppBar
          position="static"
          style={{
            background: THEME.clientModal.background
          }}
        >
          <Toolbar>
            <Typography variant="title" style={{ color: "#fff" }}>
              Notebook History
            </Typography>
          </Toolbar>
        </AppBar>
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

function mapDispatchToProps(dispatch) {
  return {
    getNotebookRevisionList: () => {
      dispatch(getNotebookRevisionList());
    }
  };
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
  mapDispatchToProps
)(HistoryModalUnconnected);
