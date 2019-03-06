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
    return (
      <RevisionListContainer>
        <List>
          <ListItem
            button
            key="local-changes"
            onClick={() => this.revisionClicked(undefined)}
            selected={this.props.selectedRevisionId === undefined}
          >
            <ListItemText primary="Unsaved Changes" />
          </ListItem>
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

function mapDispatchToProps(dispatch) {
  return {
    updateSelectedRevisionId: revisionId => {
      dispatch(updateSelectedRevisionId(revisionId));
    }
  };
}

export function mapStateToProps(state) {
  const notebookHistory = state.notebookHistory || {};
  const { revisionList, selectedRevisionId } = notebookHistory;

  return {
    revisionList,
    selectedRevisionId
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RevisionListUnconnected);
