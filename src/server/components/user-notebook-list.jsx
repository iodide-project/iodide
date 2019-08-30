import React from "react";
import PropTypes from "prop-types";
import MoreHoriz from "@material-ui/icons/MoreHoriz";

import Paginatedlist from "./paginated-list";
import {
  ListItem,
  ListMain,
  ListDate,
  ListPrimaryText,
  ListLinkSet,
  ListMetadata
} from "../../shared/components/list";
import UserNotebookMiniLinks from "./user-notebook-mini-links";
import NotebookActionsMenu from "./notebook-actions-menu";
import { ActionsContainer, BodyIconStyle } from "../style/icon-styles";

import { monthDayYear } from "../../shared/date-formatters";

export default class UserNotebookList extends React.Component {
  static propTypes = {
    notebooks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string
      })
    ),
    showMenu: PropTypes.bool,
    pageSize: PropTypes.number,
    isUserAccount: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.state = { notebooks: this.props.notebooks };
    this.deleteNotebook = this.deleteNotebook.bind(this);
  }

  deleteNotebook(nbID) {
    const notebooks = this.state.notebooks.filter(nb => nb.id !== nbID);
    this.setState({ notebooks });
  }

  render() {
    return (
      <Paginatedlist
        pageSize={this.props.pageSize || 7}
        rows={this.state.notebooks}
        getRow={d => (
          <ListItem key={d.id} type="single">
            <ListMain>
              <ListPrimaryText>
                <a href={`/notebooks/${d.id}/`}>{d.title}</a>
              </ListPrimaryText>
            </ListMain>
            <ListMetadata>
              <ListLinkSet>
                <UserNotebookMiniLinks id={d.id} />
              </ListLinkSet>
            </ListMetadata>
            <ListDate>
              <a href={`/notebooks/${d.id}/revisions`}>
                {monthDayYear(d.latestRevision || d.last_revision)}
              </a>
            </ListDate>
            {this.props.showMenu && (
              <ListMetadata>
                <ActionsContainer>
                  <NotebookActionsMenu
                    isUserAccount={this.props.isUserAccount}
                    triggerElement={
                      <MoreHoriz width={15} className={BodyIconStyle} />
                    }
                    notebookID={d.id}
                    notebookTitle={d.title}
                    onDelete={this.deleteNotebook}
                  />
                </ActionsContainer>
              </ListMetadata>
            )}
          </ListItem>
        )}
      />
    );
  }
}
