import React from 'react'
import styled from 'react-emotion'
import FileIcon from '@material-ui/icons/Note'
import MoreHoriz from '@material-ui/icons/MoreHoriz'

import FileActionsMenu from './file-actions-menu'
import { BodyIconStyle, ActionsContainer } from '../style/icon-styles'


const bytesToHumanReadable = (bytes) => {
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024
  const TB = GB * 1024
  const round = (n, k = 2) => Math.round(n * ((10 * k) || 1)) / (10 * (k) || 1)
  if (bytes < 1024) return `${bytes}b`
  if (bytes < MB) return `${round(bytes / KB, 0)}kb`
  if (bytes < GB) return `${round(bytes / MB)}mb`
  return `${round(bytes / TB, 3)}gb`
}

const FileTable = styled('table')`

td {
    border: 0;
    margin: 0;
    border-spacing:0;
}
`

const FileElement = styled('tr')`
font-size: 14px;
`

const FileIconContainer = styled('td')`
width: 25px;
color: gray;
padding:4px;
vertical-align: middle;
`

const FileNameContainer = styled('td')`
padding:4px;
padding-left:12px;
padding-right:12px;
vertical-align: middle;
min-width: 120px;
`

const FileSizeContainer = styled('td')`
font-size: .9em;
color:gray;
font-style: italic;
padding:4px;
vertical-align: middle;
`

export default class FilesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { files: this.props.files }
    this.onDelete = this.onDelete.bind(this)
  }

  onDelete(fileID) {
    const files = this.state.files.filter(r => r.id !== fileID);
    this.setState({ files });
  }

  render() {
    const { isUserAccount, notebookID } = this.props
    const { files } = this.state
    return (
      <React.Fragment>
        <FileTable>
          <tbody>
            {
                files.map(file => (
                  <FileElement key={file.filename}>
                    <FileIconContainer>
                      <FileIcon />
                    </FileIconContainer>
                    <FileNameContainer>
                      <a href={`/notebooks/${this.props.notebookID}/files/${file.filename}`}>{file.filename}</a>
                    </FileNameContainer>
                    <FileSizeContainer>
                      {bytesToHumanReadable(file.size)}
                    </FileSizeContainer>
                    {
                      isUserAccount ?
                        <td>
                          <ActionsContainer>
                            <FileActionsMenu
                              triggerElement={<MoreHoriz className={BodyIconStyle} />}
                              fileID={file.id}
                              notebookID={notebookID}
                              filename={file.filename}
                              onDelete={this.onDelete}
                            />
                          </ActionsContainer>
                        </td> :
                      undefined
                    }
                  </FileElement>
                ))
            }
          </tbody>
        </FileTable>
      </React.Fragment>
    )
  }
}
