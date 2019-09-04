import React from "react";
import PropTypes from "prop-types";
import PaginatedList from "./paginated-list";
import {
  ListIcon,
  ListItem,
  ListMain,
  ListPrimaryText,
  ListSecondaryText,
  ListDate,
  ListAuthor,
  ListMetadata,
  ListLinkSet
} from "../../shared/components/list";
import UserNotebookMiniLinks from "./user-notebook-mini-links";
import { SmallUserName as UserName } from "../components/user-name";
import { monthDayYear } from "../../shared/date-formatters";

export const PAGE_SIZE = 15;

export default class TrendingNotebooksList extends React.Component {
  static propTypes = {
    notebookList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        owner: PropTypes.string,
        avatar: PropTypes.string,
        latestRevision: PropTypes.string
      })
    )
  };
  constructor(props) {
    super(props);
    this.state = { currentPage: 0 };
    this.totalPages = Math.floor(this.props.notebookList.length / PAGE_SIZE);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  next() {
    const { currentPage } = this.state;
    if (currentPage !== this.totalPages) {
      this.setState({
        currentPage: currentPage + 1
      });
    }
  }

  prev() {
    const { currentPage } = this.state;
    if (currentPage > 0) {
      this.setState({ currentPage: currentPage - 1 });
    }
  }

  render() {
    const { currentPage } = this.state;
    const ind = currentPage * PAGE_SIZE;
    const visibleNotebooks = this.props.notebookList.slice(
      ind,
      ind + PAGE_SIZE
    );
    if (visibleNotebooks.length !== PAGE_SIZE) {
      new Array(PAGE_SIZE - visibleNotebooks.length).fill(null).forEach(() => {
        visibleNotebooks.push(undefined);
      });
    }
    return (
      <React.Fragment>
        <PaginatedList
          pageSize={10}
          header={["Owner", "Last Updated", "Notebook"]}
          rows={this.props.notebookList}
          getRow={d => (
            <ListItem type="single" key={d.id}>
              <ListIcon>
                <UserName avatar={d.avatar} username={d.owner} />
              </ListIcon>
              <ListMain>
                <ListPrimaryText>
                  <a href={`/notebooks/${d.id}/`}>{d.title}</a>
                </ListPrimaryText>
                <ListSecondaryText>
                  <ListAuthor>
                    {" "}
                    <a href={`/${d.owner}`}>{d.owner}</a>
                  </ListAuthor>
                </ListSecondaryText>
              </ListMain>
              <ListMetadata>
                <ListLinkSet>
                  <UserNotebookMiniLinks id={d.id} />
                </ListLinkSet>
              </ListMetadata>
              <ListDate>
                <a href={`/notebooks/${d.id}/revisions`}>
                  {monthDayYear(d.latestRevision)}
                </a>
              </ListDate>
            </ListItem>
          )}
        />
      </React.Fragment>
    );
  }
}

TrendingNotebooksList.propTypes = {
  notebookList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      owner: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    })
  )
};
