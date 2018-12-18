import React from 'react';
import styled from 'react-emotion';
import Settings from '@material-ui/icons/Settings'
import MoreHoriz from '@material-ui/icons/MoreHoriz'

import PageBody from '../components/page-body';
import Header from '../components/header';
import BelowFoldContainer from '../components/page-containers/below-fold-container'
import Table from '../components/table';
import { MediumUserName } from '../components/user-name';
import { fetchWithCSRFTokenAndJSONContent } from '../../shared/fetch-with-csrf-token';
import NotebookActionsMenu from '../components/notebook-actions-menu';
import RevisionActionsMenu from '../components/revision-actions-menu';
import FilesList from '../components/files-list'

import { BodyIconStyle, ActionsContainer } from '../style/icon-styles'
import { formatServerDate } from '../../shared/date-formatters'

const RevisionsPageHeader = styled('h2')`
span {
  font-style: italic;
  color: gray;
  font-weight: 300;
}

a {
  text-decoration: none;
  color:black;
}

a:hover {
  text-decoration: underline;
}
`

const ForkedFromLinkContainer = styled('div')`
margin-bottom: 20px;
font-style: italic;
font-weight: 300;
font-size:14px;

a {
  color: gray;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
`

const ForkedFromLink = ({
  revisionID, notebookID, forkOwner, forkTitle,
}) => {
  const revisionLink = `/notebooks/${notebookID}?revision=${revisionID}`
  return (
    <ForkedFromLinkContainer>
      forked from <a href={`/${forkOwner}`}>{forkOwner}</a> / <a href={revisionLink}>{forkTitle}</a>
    </ForkedFromLinkContainer>
  )
}

export default class RevisionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { revisions: this.props.revisions, files: this.props.files };
    this.onDeleteNotebook = this.onDeleteNotebook.bind(this);
    this.onDeleteRevision = this.onDeleteRevision.bind(this);
    this.onDeleteFile = this.onDeleteFile.bind(this);
    this.onUploadFile = this.onUploadFile.bind(this)
  }

  onUploadFile(newFileInfo) {
    const files = this.state.files.filter(f => f.filename !== newFileInfo.filename)
    files.push(newFileInfo)
    files.sort((a, b) => a.last_updated < b.last_updated)
    this.setState({ files })
  }

  onDeleteNotebook() {
    window.location = `/${this.props.userInfo.name}/`;
  }

  onDeleteFile(fileID) {
    const files = this.state.files.filter(r => r.id !== fileID);
    this.setState({ files });
  }

  onDeleteRevision(revisionID) {
    if (this.state.revisions.length === 1) {
      fetchWithCSRFTokenAndJSONContent(`/api/v1/notebooks/${this.props.ownerInfo.notebookId}/`, {
        method: 'DELETE',
      }).then(this.onDeleteNotebook);
    } else {
      const revisions = this.state.revisions.filter(r => r.id !== revisionID);
      this.setState({ revisions });
    }
  }

  render() {
    const isCurrentUsersPage = (this.props.ownerInfo.username === this.props.userInfo.name);
    const forkedFrom = Boolean(this.props.ownerInfo.forkedFromRevisionID)
    return (
      <div>
        <Header userInfo={this.props.userInfo} />
        <PageBody>
          <BelowFoldContainer>
            <RevisionsPageHeader>
              <a href={`/notebooks/${this.props.ownerInfo.notebookId}`}>
                {this.props.ownerInfo.title}
              </a> <span> / revisions</span>
            </RevisionsPageHeader>
            {
            forkedFrom ?
              <ForkedFromLink
                revisionID={this.props.ownerInfo.forkedFromRevisionID}
                notebookID={this.props.ownerInfo.forkedFromNotebookID}
                forkOwner={this.props.ownerInfo.forkedFromUsername}
                forkTitle={this.props.ownerInfo.forkedFromTitle}
              /> :
              undefined
          }
            <MediumUserName
              username={this.props.ownerInfo.username}
              fullName={this.props.ownerInfo.full_name}
              avatar={this.props.ownerInfo.avatar}
            />
            {
            isCurrentUsersPage &&
            <ActionsContainer>
              <NotebookActionsMenu
                triggerElement={<Settings
                  style={{ width: BodyIconStyle.width }}
                  className={BodyIconStyle}
                />}
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
          }
            <FilesList
              notebookID={this.props.ownerInfo.notebookId}
              isUserAccount={isCurrentUsersPage}
              files={this.state.files}
              onDelete={this.onDeleteFile}
            />
            <h3>Notebook Revisions</h3>
            <Table>
              <tbody>
                <tr>
                  <th>When</th>
                  <th>Title</th>
                  {isCurrentUsersPage ? <th>Actions</th> : undefined}
                </tr>
                {
                        this.state.revisions.map((r, i) => (
                          <tr key={r.id}>
                            <td><a href={`/notebooks/${r.notebookId}/?revision=${r.id}`}>{formatServerDate(r.date)}</a></td>
                            <td>
                              <a href={`/notebooks/${r.notebookId}/?revision=${r.id}`}>
                                { (i > 0 && this.state.revisions[i].title === this.state.revisions[i - 1].title) ? '-' : r.title }
                              </a>
                            </td>
                            {
                                isCurrentUsersPage ?
                                  <td>
                                    <ActionsContainer>
                                      <RevisionActionsMenu
                                        triggerElement={<MoreHoriz className={BodyIconStyle} />}
                                        notebookID={r.notebookId}
                                        revisionID={r.id}
                                        revisionTitle={r.title}
                                        notebookTitle={this.props.ownerInfo.notebookId}
                                        onDelete={this.onDeleteRevision}
                                      />
                                    </ActionsContainer>
                                  </td> :
                              undefined
                              }
                          </tr>
                        ))
                    }
              </tbody>
            </Table>
          </BelowFoldContainer>
        </PageBody>
      </div>
    )
  }
}
