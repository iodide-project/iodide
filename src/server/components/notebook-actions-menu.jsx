import React from 'react'
import Popover from './popover'
import Menu from './menu'
import MenuItem from './menu-item'
import MenuDivider from './menu-divider'
import DeleteModal from './delete-modal'
import fetchWithCSRFToken from '../../shared/fetch-with-csrf-token'

export default class NotebookActionsMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = { deleteModalVisible: false }
    this.deleteNotebook = this.deleteNotebook.bind(this)
    this.showDeleteModal = this.showDeleteModal.bind(this)
    this.hideDeleteModal = this.hideDeleteModal.bind(this)
    this.goToRevisionsPage = this.goToRevisionsPage.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  hideDeleteModal() {
    this.setState({ deleteModalVisible: false })
  }

  showDeleteModal() {
    this.setState({ deleteModalVisible: true })
  }

  deleteNotebook() {
    this.showDeleteModal();
  }

  uploadFile(notebookID) {
    console.log(this)
    const filePicker = document.createElement('input')
    filePicker.type = 'file'
    filePicker.id = 'file-picker'
    filePicker.name = 'files[]'
    filePicker.click();
    filePicker.addEventListener('change', (evt) => {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const content = new Blob([reader.result], { type: 'application/octet-stream' })
        const formData = new FormData();
        formData.append('metadata', JSON.stringify({
          filename: file.name,
          notebook_id: notebookID,
        }))
        formData.append('file', content)
        fetchWithCSRFToken('/api/v1/files/', {
          body: formData,
          method: 'POST',
        }).then(() => {
          console.log('THIS WAS SUCCESSFUL.')
        }).catch((err) => {
          console.error(err)
        })
      }
      reader.readAsBinaryString(file);
    })
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
              onClick={() => this.uploadFile(this.props.notebookID)}
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
      </React.Fragment>
    )
  }
}
