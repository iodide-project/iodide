import React from 'react';
import styled from 'react-emotion';
import MoreHoriz from '@material-ui/icons/MoreHoriz'

import Header from '../components/header';
import PageBody from '../components/page-body';
import BelowFoldContainer from '../components/page-containers/below-fold-container'
import PaginatedList from '../components/paginated-list'
import { ListItem, ListMain, ListPrimaryText, ListDate, ListMetadata } from '../components/list'
import AttentionBlock from '../components/attention-block'
import NotebookActionsMenu from '../components/notebook-actions-menu'
import NewNotebookButton from '../components/new-notebook-button'
import { ActionsContainer, BodyIconStyle } from '../style/icon-styles'
import { monthDayYear } from '../../shared/date-formatters'

const NotebookListContainer = styled('div')`
margin-top:20px;
`

const UserInformationContainer = styled('div')`
img {
  border-radius: 5px;
}

h1 {
  margin-top: 20;
  margin-bottom: 0;
  font-weight: 900;
  text-transform: uppercase;
}

h2 {
  font-weight:300;
  margin-top:0;
}
`

class UserNotebookList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { notebookList: this.props.notebookList }
    this.deleteNotebook = this.deleteNotebook.bind(this)
  }

  deleteNotebook(nbID) {
    const notebookList = this.state.notebookList.filter(nb => nb.id !== nbID)
    this.setState({ notebookList })
  }

  render() {
    const { notebookList } = this.state
    if (!notebookList.length) {
      return <UserPageWithoutNotebooksPlaceholder isUserAccount={this.props.isUserAccount} />
    }
    return (
      <React.Fragment>
        <NewNotebookButton />

        <h2>
            notebooks
        </h2>
        <NotebookListContainer>
          <PaginatedList
            pageSize={10}
            rows={notebookList}
            getRow={notebook => (
              <ListItem type="single" key={notebook.id}>
                <ListMain>
                  <ListPrimaryText>
                    <a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a>
                  </ListPrimaryText>
                </ListMain>
                <ListDate>
                  {monthDayYear(notebook.last_revision)}
                </ListDate>
                <ListMetadata>
                  <ActionsContainer>
                    <NotebookActionsMenu
                      isUserAccount={this.props.isUserAccount}
                      triggerElement={<MoreHoriz width={15} className={BodyIconStyle} />}
                      notebookID={notebook.id}
                      notebookTitle={notebook.title}
                      onDelete={this.deleteNotebook}
                    />
                  </ActionsContainer>
                </ListMetadata>
              </ListItem>
            )}
          />
        </NotebookListContainer>
      </React.Fragment>

    )
  }
}


export const UserPageWithoutNotebooksPlaceholder = ({ isUserAccount }) => (
  <AttentionBlock>
    {
      isUserAccount ?
        <React.Fragment>
          <div>
              Shall we get started?
          </div>
          <NewNotebookButton />
        </React.Fragment> : 'This user regrettably has no notebooks.'
        }

  </AttentionBlock>
)

export const isLoggedIn = userInfo => 'name' in userInfo

export default class UserPage extends React.Component {
  render() {
    const { thisUser, userInfo, notebookList } = this.props
    return (
      <div>
        <Header userInfo={userInfo} />
        <PageBody>
          <BelowFoldContainer>
            <UserInformationContainer>
              <img width={150} src={thisUser.avatar} alt={`${thisUser.name}'s avatar`} />
              <h1 >{thisUser.full_name}
              </h1>
              <h2>{thisUser.name}</h2>
            </UserInformationContainer>

            <UserNotebookList
              isUserAccount={isLoggedIn(userInfo) && thisUser.name === userInfo.name}
              notebookList={notebookList}
            />
          </BelowFoldContainer>
        </PageBody>
      </div>
    );
  }
}
