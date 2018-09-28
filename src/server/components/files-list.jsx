import React from 'react'

import Table from './table'

export default class FilesList extends React.Component {
  render() {
    const { files } = this.props
    return (
      <React.Fragment>
        <Table>
          <thead>
            <tr>
              <th>Last Updated</th>
              <th>File Name</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {
                      files.map(file => (
                        <tr>
                          <td>{file.last_updated.slice(0, 19)}</td>
                          <td>{file.filename}</td>
                          <td>{file.size}</td>
                        </tr>
                      ))
                  }
          </tbody>
        </Table>
      </React.Fragment>
    )
  }
}
