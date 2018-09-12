import React from 'react';
import styled from 'react-emotion';
import Button from '@material-ui/core/Button';

import Header from '../components/header';
import PageBody from '../components/page-body'
import Table from '../components/table'

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

export default class HomePage extends React.Component {
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
          <h2>notebooks</h2>
          <Button
            variant="contained"
            className="header-button"
            href="/new"
          >
            New notebook
          </Button>
          <Table>
            <thead>
              <tr>
                <th>title</th>
                <th>last saved</th>
              </tr>
            </thead>
            <tbody>
              {notebookList.map(notebook => (
                <tr key={notebook.id}>
                  <td><a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a></td>
                  <td>{notebook.last_revision.slice(0, 19)}</td>
                  <td><a href={`/notebooks/${notebook.id}/revisions/`}>revisions</a></td>
                </tr>
        ))}
            </tbody>
          </Table>
        </PageBody>
      </div>
    );
  }
}
