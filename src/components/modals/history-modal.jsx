import PropTypes from "prop-types";
import React from "react";
import styled from "react-emotion";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { ModalContainer } from "./modal-container";
import { RevisionDiff } from "./revision-diff";
import { RevisionList } from "./revision-list";
import {
  getNotebookRevisionList,
  updateSelectedRevisionId
} from "../../actions/actions";
import { getPreviousRevisionId } from "../../tools/revision-history";
import THEME from "../../shared/theme";

const ModalContentContainer = styled("div")`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-column-gap: 20px;
  padding: 0px;
  overflow: auto;
  height: 100%;
`;

class HistoryModalUnconnected extends React.Component {
  static propTypes = {
    errorGettingRevisionList: PropTypes.bool,
    errorGettingRevisionContent: PropTypes.bool,
    getNotebookRevisionList: PropTypes.func.isRequired,
    gettingRevisionContent: PropTypes.bool,
    currentRevisionContent: PropTypes.string,
    previousRevisionContent: PropTypes.string,
    revisionList: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired
      })
    ),
    selectedRevisionId: PropTypes.number,
    updateSelectedRevisionId: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.revisionClicked = this.revisionClicked.bind(this);
  }

  componentDidMount() {
    this.props.getNotebookRevisionList();
  }

  revisionClicked(revisionId) {
    if (this.props.selectedRevisionId === revisionId) {
      return;
    }

    this.props.updateSelectedRevisionId(revisionId);
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
        {this.props.gettingRevisionList && <p>Getting revisions...</p>}
        {this.props.errorGettingRevisionList && <p>Error getting revisions</p>}
        {!this.props.gettingRevisionList &&
          !this.props.errorGettingRevisionList && (
            <ModalContentContainer>
              <RevisionList
                revisionList={this.props.revisionList}
                selectedRevisionId={this.props.selectedRevisionId}
                revisionClicked={this.revisionClicked}
              />
              <RevisionDiff
                gettingRevisionContent={this.props.gettingRevisionContent}
                previousRevisionContent={this.props.previousRevisionContent}
                currentRevisionContent={this.props.currentRevisionContent}
              />
            </ModalContentContainer>
          )}
      </ModalContainer>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getNotebookRevisionList: () => {
      dispatch(getNotebookRevisionList());
    },
    updateSelectedRevisionId: revisionId => {
      dispatch(updateSelectedRevisionId(revisionId));
    }
  };
}

export function mapStateToProps(state) {
  const notebookHistory = state.notebookHistory || {};
  const {
    errorGettingRevisionList,
    errorGettingRevisionContent,
    revisionList,
    selectedRevisionId,
    revisionContent,
    gettingRevisionList,
    gettingRevisionContent
  } = notebookHistory;

  let { currentRevisionContent, previousRevisionContent } = {};
  if (selectedRevisionId !== undefined) {
    currentRevisionContent = revisionContent[selectedRevisionId];
    const previousRevisionId = getPreviousRevisionId(
      revisionList,
      selectedRevisionId
    );
    previousRevisionContent = previousRevisionId
      ? revisionContent[previousRevisionId]
      : "";
  } else if (revisionList) {
    // looking at changes (if any) since last save
    currentRevisionContent = state.jsmd;
    previousRevisionContent =
      revisionList.length > 0 ? revisionContent[revisionList[0].id] : "";
  }

  return {
    currentRevisionContent,
    errorGettingRevisionList,
    errorGettingRevisionContent,
    gettingRevisionContent,
    gettingRevisionList,
    revisionList,
    selectedRevisionId,
    previousRevisionContent
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryModalUnconnected);
