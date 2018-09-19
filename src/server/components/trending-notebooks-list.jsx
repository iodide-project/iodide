import React from 'react';
import PropTypes from 'prop-types';

import Table from '../components/table'
import { SmallUserName as UserName } from '../components/user-name'
import NewNotebookButton from './new-notebook-button'

export default class TrendingNotebooksList extends React.Component {
  render() {
    return (
      <React.Fragment>
        <NewNotebookButton />

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
      </React.Fragment>
    )
  }
}

TrendingNotebooksList.propTypes = {
  notebookList: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  })),
}
