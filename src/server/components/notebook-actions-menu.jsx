import React from 'react'
import Popover from '../../shared/components/popover'
import Menu from '../../shared/components/menu'
import MenuItem from '../../shared/components/menu-item'
import MenuDivider from '../../shared/components/menu-divider'
import DeleteModal from './delete-modal'
import UploadModal from './upload-modal'
import { selectFileAndFormatMetadata, uploadFile, updateFile } from '../../shared/upload-file'

export default class NotebookActionsMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteModalVisible: false,
      uploadFileConfirmationVisible: false,
      newFile: undefined,
      oldFile: undefined,
    }
    // notebook delete functions
    this.deleteNotebook = this.deleteNotebook.bind(this)
    this.showDeleteModal = this.showDeleteModal.bind(this)
    this.hideDeleteModal = this.hideDeleteModal.bind(this)
    // file handling functions
    this.selectFile = this.selectFile.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.updateFile = this.updateFile.bind(this)
    this.hideUploadFileConfirmationModal = this.hideUploadFileConfirmationModal.bind(this)
    // nav functions
    this.goToRevisionsPage = this.goToRevisionsPage.bind(this)
  }

  selectFile(notebookID) {
    selectFileAndFormatMetadata(notebookID)
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
          this.setState({ newFile: undefined })
          this.uploadFile(formData)
        } else {
          // if filename is in this.props.files ask before uploading and replacing.
          const oldFile = this.props.files.filter(f => f.filename === filename)[0]
          this.setState({ newFile: formData, uploadFileConfirmationVisible: true, oldFile })
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

  updateFile() {
    return updateFile(this.state.oldFile.id, this.state.newFile)
      .then(response => response.json())
      .then((response) => {
        if (this.props.onUploadFile) this.props.onUploadFile(response)
        this.hideUploadFileConfirmationModal()
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
            { (this.props.isUserAccount && this.props.onUploadFile) ?
              <MenuItem
                onClick={() => this.selectFile(this.props.notebookID)}
              >Upload a File ...
              </MenuItem> : undefined
            }
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
          onUpdateFile={this.updateFile}
          oldFile={this.state.oldFile}
        />
      </React.Fragment>
    )
  }
}
