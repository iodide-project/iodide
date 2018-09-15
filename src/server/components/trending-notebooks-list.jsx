import React from 'react';

import Table from '../components/table'
import { SmallUserName as UserName } from '../components/user-name'

export default class TrendingNotebooksList extends React.Component {
  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th>Notebook</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.notebookList.map(notebook => (
              <tr key={notebook.id}>
                <td>
                  <a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a>
                </td>
                <td>
                  <UserName avatar={notebook.avatar} username={notebook.owner} />
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}
