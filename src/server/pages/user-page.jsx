import React from 'react';
import styled from 'react-emotion';
import MoreHoriz from '@material-ui/icons/MoreHoriz'

import Header from '../components/header';
import PageBody from '../components/page-body'
import Table from '../components/table'
import AttentionBlock from '../components/attention-block'
import NotebookActionsMenu from '../components/notebook-actions-menu'
import NewNotebookButton from '../components/new-notebook-button'
import { ActionsContainer, BodyIconStyle } from '../style/icon-styles'

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
    if (!this.state.notebookList.length) {
      return <UserPageWithoutNotebooksPlaceholder isUserAccount={this.props.isUserAccount} />
    }
    return (
      <React.Fragment>
        <h2>
            notebooks
        </h2>
        <NewNotebookButton />
        <Table>
          <thead>
            <tr>
              <th>title</th>
              <th>last saved</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.notebookList.map(notebook => (
              <tr key={notebook.id}>
                <td><a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a></td>
                <td>{notebook.last_revision.slice(0, 19)}</td>
                <td>
                  <ActionsContainer>
                    <NotebookActionsMenu
                      triggerElement={<MoreHoriz className={BodyIconStyle} />}
                      notebookID={notebook.id}
                      notebookTitle={notebook.title}
                      onDelete={this.deleteNotebook}
                    />
                  </ActionsContainer>
                </td>
              </tr>
            ))
          }
          </tbody>
        </Table>
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

export default class UserPage extends React.Component {
  render() {
    const { thisUser, userInfo, notebookList } = this.props
    return (
      <div>
        <Header userInfo={userInfo} />
        <PageBody>
          <UserInformationContainer>
            <img width={150} src={thisUser.avatar} alt={`${thisUser.name}'s avatar`} />
            <h1 >{thisUser.full_name}
            </h1>
            <h2>{thisUser.name}</h2>
          </UserInformationContainer>

          <UserNotebookList
            isUserAccount={thisUser.username === userInfo.username}
            notebookList={notebookList}
          />
        </PageBody>
      </div>
    );
  }
}
