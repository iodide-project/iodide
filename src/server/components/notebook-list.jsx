import React from 'react';

const trStyle = {

  textAlign: 'left',
}

export default class NotebookList extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr style={trStyle}>
            <th>Notebook</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.notebookList.map(notebook => (
              <tr key={notebook.id} style={trStyle}>
                <td>
                  <a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a>
                </td>
                <td>
                  <a href={`/${notebook.owner}`}>{notebook.owner}</a>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }
}
