import React from 'react'
import Popover from './popover'
import Menu from './menu'
import MenuItem from './menu-item'
import MenuDivider from './menu-divider'
import DeleteModal from './delete-modal'
import UploadModal from './upload-modal'
import { selectFile, uploadFile } from '../../shared/upload-file'

export default class NotebookActionsMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteModalVisible: false,
      uploadFileConfirmationVisible: false,
      currentFile: undefined,
      oldFile: undefined,
    }
    // notebook delete functions
    this.deleteNotebook = this.deleteNotebook.bind(this)
    this.showDeleteModal = this.showDeleteModal.bind(this)
    this.hideDeleteModal = this.hideDeleteModal.bind(this)
    // file handling functions
    this.onSelectFile = this.onSelectFile.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.hideUploadFileConfirmationModal = this.hideUploadFileConfirmationModal.bind(this)
    // nav functions
    this.goToRevisionsPage = this.goToRevisionsPage.bind(this)
  }

  onSelectFile(notebookID) {
    selectFile(notebookID)
      .then((formData) => {
        let filename
        try {
          const metadata = JSON.parse(formData.get('metadata'))
          filename = metadata.filename // eslint-disable-line
        } catch (err) {
          throw err
        }
        const fileDoesntExistYet = !this.props.files.map(f => f.filename).includes(filename)
        if (fileDoesntExistYet) {
          this.setState({ currentFile: undefined })
          this.uploadFile(formData)
        } else {
          // if filename is in this.props.files ask before uploading and replacing.
          const oldFile = this.props.files.filter(f => f.filename === filename)[0]
          this.setState({ currentFile: formData, uploadFileConfirmationVisible: true, oldFile })
        }
      })
  }

  uploadFile(formData) {
    return uploadFile(formData)
      .then(response => response.json())
      .then((response) => {
        if (this.props.onUploadFile) this.props.onUploadFile(response)
      })
  }

  hideDeleteModal() {
    this.setState({ deleteModalVisible: false })
  }

  showDeleteModal() {
    this.setState({ deleteModalVisible: true })
  }

  hideUploadFileConfirmationModal() {
    this.setState({ uploadFileConfirmationVisible: false })
  }

  deleteNotebook() {
    this.showDeleteModal();
  }

  goToRevisionsPage() {
    window.location = `/notebooks/${this.props.notebookID}/revisions/`
  }

  render() {
    if (this.props.hideRevisions && !this.props.isUserAccount) return null
    return (
      <React.Fragment>
        <Popover
          title={this.props.triggerElement}
          placement={this.props.placement || 'bottom-start'}
        >
          <Menu>
            {this.props.hideRevisions ? undefined :
            <MenuItem onClick={this.goToRevisionsPage}>View Revisions...</MenuItem>}
            <MenuItem
              onClick={() => this.onSelectFile(this.props.notebookID)}
            >Upload a File ...
            </MenuItem>
            {this.props.hideRevisions || !this.props.isUserAccount ? undefined : <MenuDivider />}
            {!this.props.isUserAccount ? undefined :
            <MenuItem onClick={this.deleteNotebook}>Delete This Notebook...</MenuItem>}
          </Menu>
        </Popover>
        <DeleteModal
          visible={this.state.deleteModalVisible}
          onClose={this.hideDeleteModal}
          title={`delete the notebook  "${this.props.notebookTitle}"?`}
          content={this.props.modalBody}
          onCancel={this.hideDeleteModal}
          onDelete={this.props.onDelete}
          elementID={this.props.notebookID}
          url={`/api/v1/notebooks/${this.props.notebookID}/`}
        />
        <UploadModal
          visible={this.state.uploadFileConfirmationVisible}
          onClose={this.hideUploadFileConfirmationModal}
          onCancel={this.hideUploadFileConfirmationModal}
          onUpload={() => {
            console.debug(this.state.currentFile)
            this.uploadFile(this.state.currentFile)
          }}
          oldFile={this.state.oldFile}
          notebookID={this.props.notebookID}
          url={`/api/v1/notebooks/${this.props.notebookID}/files/`}
        />
      </React.Fragment>
    )
  }
}
