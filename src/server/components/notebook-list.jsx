import React from 'react';


export default class NotebookList extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Notebook</th><th>Owner</th>
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
                  {notebook.owner}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }
}
