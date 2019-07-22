import PropTypes from "prop-types";
import React from "react";
import styled from "react-emotion";
import { connect } from "react-redux";
import format from "date-fns/format";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { updateSelectedRevisionId } from "../../actions/actions";

const RevisionListContainer = styled("div")`
  overflow: auto;
`;

class RevisionListUnconnected extends React.Component {
  static propTypes = {
    revisionList: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired
      })
    ),
    selectedRevisionId: PropTypes.number,
    hideLocalChanges: PropTypes.bool,
    updateSelectedRevisionId: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.revisionClicked = this.revisionClicked.bind(this);
  }

  revisionClicked(revisionId) {
    if (this.props.selectedRevisionId === revisionId) {
      return;
    }

    this.props.updateSelectedRevisionId(revisionId);
  }

  render() {
    if (this.props.revisionList !== undefined) {
      if (
        this.props.hideLocalChanges &&
        this.props.selectedRevisionId === undefined
      ) {
        if (this.props.revisionList.length > 0) {
          this.revisionClicked(this.props.revisionList[0].id);
        }
      }
    }

    return (
      <RevisionListContainer>
        <List>
          {!this.props.hideLocalChanges && (
            <ListItem
              button
              key="local-changes"
              onClick={() => this.revisionClicked(undefined)}
              selected={this.props.selectedRevisionId === undefined}
            >
              <ListItemText primary="Unsaved Changes" />
            </ListItem>
          )}
          {this.props.revisionList &&
            this.props.revisionList.map(revision => (
              <ListItem
                button
                key={`revision-${revision.id}`}
                onClick={() => this.revisionClicked(revision.id)}
                selected={this.props.selectedRevisionId === revision.id}
              >
                <ListItemText
                  primary={format(
                    new Date(revision.created),
                    "MMM dd, uuuu HH:mm:ss"
                  )}
                />
              </ListItem>
            ))}
        </List>
      </RevisionListContainer>
    );
  }
}

export function mapStateToProps(state) {
  const notebookHistory = state.notebookHistory || {};
  const {
    revisionContentFetchStatus,
    revisionContent,
    revisionList,
    selectedRevisionId
  } = notebookHistory;

  let hideLocalChanges = true;

  if (revisionContentFetchStatus === "IDLE") {
    const previousRevisionContent =
      revisionList.length > 0 ? revisionContent[revisionList[0].id] : "";

    hideLocalChanges = state.iomd === previousRevisionContent;
  }

  return {
    revisionList,
    selectedRevisionId,
    hideLocalChanges
  };
}

export default connect(
  mapStateToProps,
  { updateSelectedRevisionId } // mapDispatchToProps shorthand
)(RevisionListUnconnected);
