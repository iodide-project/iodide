import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Settings from "@material-ui/icons/Settings";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import format from "date-fns/format";

import PageBody from "../components/page-body";
import Header from "../components/header";
import BelowFoldContainer from "../components/page-containers/below-fold-container";
import { MediumUserName } from "../components/user-name";
import { deleteNotebookRequest } from "../../shared/server-api/notebook";
import NotebookActionsMenu from "../components/notebook-actions-menu";
import RevisionActionsMenu from "../components/revision-actions-menu";
import FilesList from "../components/files-list";

import { BodyIconStyle, ActionsContainer } from "../style/icon-styles";

import PaginatedList from "../components/paginated-list";
import {
  ListItem,
  ListMain,
  ListPrimaryText,
  ListLinkSet,
  ListDate,
  ListMetadata,
  ListSmallLink
} from "../../shared/components/list";

const RevisionsPageHeader = styled("h2")`
  span {
    font-style: italic;
    color: gray;
    font-weight: 300;
  }

  a {
    text-decoration: none;
    color: black;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const RevisionDateLink = styled.a`
  display: block;
  font-size: ${props => (props.size === "small" ? "12px" : "auto")};
`;

const ForkedFromLinkContainer = styled("div")`
  margin-bottom: 20px;
  font-style: italic;
  font-weight: 300;
  font-size: 14px;

  a {
    color: gray;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const ForkedFromLink = ({ revisionID, notebookID, forkOwner, forkTitle }) => {
  const revisionLink = `/notebooks/${notebookID}?revision=${revisionID}`;
  return (
    <ForkedFromLinkContainer>
      forked from <a href={`/${forkOwner}`}>{forkOwner}</a> /{" "}
      <a href={revisionLink}>{forkTitle}</a>
    </ForkedFromLinkContainer>
  );
};

ForkedFromLink.propTypes = {
  revisionID: PropTypes.number,
  notebookID: PropTypes.number,
  forkOwner: PropTypes.string,
  forkTitle: PropTypes.string
};

export default class RevisionsPage extends React.Component {
  static propTypes = {
    userInfo: PropTypes.shape({
      name: PropTypes.string
    }),
    headerMessage: PropTypes.string,
    ownerInfo: PropTypes.shape({
      notebookId: PropTypes.number,
      forkedFromRevisionID: PropTypes.number,
      title: PropTypes.string,
      forkedFromTitle: PropTypes.string,
      forkedFromUsername: PropTypes.string,
      forkedFromNotebookID: PropTypes.number,
      username: PropTypes.string,
      full_name: PropTypes.string,
      avatar: PropTypes.string
    }),
    revisions: PropTypes.arrayOf(
      PropTypes.shape({
        notebookId: PropTypes.number,
        id: PropTypes.number,
        title: PropTypes.string
      })
    ),
    files: PropTypes.arrayOf(PropTypes.shape({}))
  };
  constructor(props) {
    super(props);
    this.state = { revisions: this.props.revisions, files: this.props.files };
    this.onDeleteNotebook = this.onDeleteNotebook.bind(this);
    this.onDeleteRevision = this.onDeleteRevision.bind(this);
    this.onDeleteFile = this.onDeleteFile.bind(this);
    this.onUploadFile = this.onUploadFile.bind(this);
  }

  onUploadFile(newFileInfo) {
    const files = this.state.files.filter(
      f => f.filename !== newFileInfo.filename
    );
    files.push(newFileInfo);
    files.sort((a, b) => a.last_updated < b.last_updated);
    this.setState({ files });
  }

  onDeleteNotebook() {
    window.location = `/${this.props.userInfo.name}/`;
  }

  onDeleteFile(fileID) {
    const files = this.state.files.filter(r => r.id !== fileID);
    this.setState({ files });
  }

  async onDeleteRevision(revisionID) {
    if (this.state.revisions.length === 1) {
      await deleteNotebookRequest(this.props.ownerInfo.notebookId);
      this.onDeleteNotebook();
    } else {
      const revisions = this.state.revisions.filter(r => r.id !== revisionID);
      this.setState({ revisions });
    }
  }

  render() {
    const isCurrentUsersPage =
      this.props.ownerInfo.username === this.props.userInfo.name;
    const forkedFrom = Boolean(this.props.ownerInfo.forkedFromRevisionID);
    return (
      <div>
        <Header
          userInfo={this.props.userInfo}
          headerMessage={this.props.headerMessage}
        />
        <PageBody>
          <BelowFoldContainer>
            <RevisionsPageHeader>
              <a href={`/notebooks/${this.props.ownerInfo.notebookId}`}>
                {this.props.ownerInfo.title}
              </a>{" "}
              <span> / revisions</span>
            </RevisionsPageHeader>
            {forkedFrom ? (
              <ForkedFromLink
                revisionID={this.props.ownerInfo.forkedFromRevisionID}
                notebookID={this.props.ownerInfo.forkedFromNotebookID}
                forkOwner={this.props.ownerInfo.forkedFromUsername}
                forkTitle={this.props.ownerInfo.forkedFromTitle}
              />
            ) : (
              undefined
            )}
            <MediumUserName
              username={this.props.ownerInfo.username}
              fullName={this.props.ownerInfo.full_name}
              avatar={this.props.ownerInfo.avatar}
            />
            {isCurrentUsersPage && (
              <ActionsContainer>
                <NotebookActionsMenu
                  triggerElement={
                    <Settings
                      style={{ width: BodyIconStyle.width }}
                      className={BodyIconStyle}
                    />
                  }
                  isUserAccount={isCurrentUsersPage}
                  hideRevisions
                  placement="right-start"
                  notebookID={this.props.ownerInfo.notebookId}
                  notebookTitle={this.props.ownerInfo.title}
                  files={this.state.files}
                  onDelete={this.onDeleteNotebook}
                  onUploadFile={this.onUploadFile}
                />
              </ActionsContainer>
            )}
            <FilesList
              notebookID={this.props.ownerInfo.notebookId}
              isUserAccount={isCurrentUsersPage}
              files={this.state.files}
              onDelete={this.onDeleteFile}
            />
            <h3>Notebook Revisions</h3>
            <PaginatedList
              pageSize={10}
              rows={this.state.revisions}
              getRow={revision => (
                <ListItem type="single" key={revision.id}>
                  <ListMain>
                    <ListPrimaryText>
                      <a
                        href={`/notebooks/${revision.notebookId}?revision=${revision.id}`}
                      >
                        {revision.title}
                      </a>
                    </ListPrimaryText>
                  </ListMain>
                  <ListMetadata>
                    <ListLinkSet>
                      <ListSmallLink
                        href={`/notebooks/${revision.notebookId}?revision=${revision.id}`}
                      >
                        explore
                      </ListSmallLink>
                      <ListSmallLink
                        href={`/notebooks/${revision.notebookId}?revision=${revision.id}&viewMode=report`}
                      >
                        report
                      </ListSmallLink>
                    </ListLinkSet>
                  </ListMetadata>
                  <ListDate>
                    <RevisionDateLink
                      href={`/notebooks/${revision.notebookId}?revision=${revision.id}`}
                    >
                      {format(new Date(revision.date), "MMM dd, uuuu")}
                    </RevisionDateLink>
                    <RevisionDateLink
                      size="small"
                      href={`/notebooks/${revision.notebookId}?revision=${revision.id}`}
                    >
                      {format(new Date(revision.date), "HH:mm:ss")}
                    </RevisionDateLink>
                  </ListDate>
                  <ListMetadata>
                    {isCurrentUsersPage ? (
                      <td>
                        <ActionsContainer>
                          <RevisionActionsMenu
                            triggerElement={
                              <MoreHoriz className={BodyIconStyle} />
                            }
                            notebookID={revision.notebookId}
                            revisionID={revision.id}
                            revisionTitle={revision.title}
                            notebookTitle={this.props.ownerInfo.notebookId}
                            onDelete={this.onDeleteRevision}
                          />
                        </ActionsContainer>
                      </td>
                    ) : (
                      undefined
                    )}
                  </ListMetadata>
                </ListItem>
              )}
            />
          </BelowFoldContainer>
        </PageBody>
      </div>
    );
  }
}
