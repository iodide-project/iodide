import React from 'react';
import styled from 'react-emotion';

import PageBody from '../components/page-body';
import Header from '../components/header';
import Table from '../components/table';
import { MediumUserName } from '../components/user-name'

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

export default class RevisionsPage extends React.Component {
  render() {
    return (
      <div>
        <Header userInfo={this.props.userInfo} />
        <PageBody>
          <RevisionsPageHeader>
            <a href={`/notebooks/${this.props.ownerInfo.notebookId}`}>
              {this.props.ownerInfo.title}
            </a> <span> / revisions</span>
          </RevisionsPageHeader>
          <MediumUserName
            username={this.props.ownerInfo.username}
            fullName={this.props.ownerInfo.full_name}
            avatar={this.props.ownerInfo.avatar}
          />
          <h3>Revisions</h3>
          <Table>
            <tbody>
              <tr>
                <th>When</th>
                <th>Title</th>
              </tr>
              {
                        this.props.revisions.map((r, i) => (
                          <tr key={r.id}>
                            <td><a href={`/notebooks/${r.notebookId}/?revision=${r.id}`}>{r.date.slice(0, 19)}</a></td>
                            <td>
                              <a href={`/notebooks/${r.notebookId}/?revision=${r.id}`}>
                                { (i > 0 && this.props.revisions[i].title === this.props.revisions[i - 1].title) ? '-' : r.title }
                              </a>
                            </td>
                          </tr>
                        ))
                    }
            </tbody>
          </Table>
        </PageBody>
      </div>
    )
  }
}
