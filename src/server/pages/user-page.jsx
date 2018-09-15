import React from 'react';
import styled from 'react-emotion';

import Header from '../components/header';
import PageBody from '../components/page-body'
import Table from '../components/table'
import DeleteElementButton from '../components/delete-element-button'
import { ContainedButton } from '../components/buttons'
import AttentionBlock from '../components/attention-block'

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
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.notebookList.map(notebook => (
              <tr key={notebook.id}>
                <td><a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a></td>
                <td>{notebook.last_revision.slice(0, 19)}</td>
                <td><a href={`/notebooks/${notebook.id}/revisions/`}>revisions</a></td>
                <td>
                  <DeleteElementButton
                    url={`/api/v1/notebooks/${notebook.id}/`}
                    onDelete={this.deleteNotebook}
                    modalTitle={`delete the notebook  "${notebook.title}"?`}
                    elementID={notebook.id}
                  />
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

const NewNotebookButton = () => (<ContainedButton target="_blank" href="/new">+ New Notebook</ContainedButton>)


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
