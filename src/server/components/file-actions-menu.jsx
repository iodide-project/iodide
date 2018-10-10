import React from 'react'
import Popover from './popover'
import Menu from './menu'
import MenuItem from './menu-item'
import DeleteModal from './delete-modal'

export default class FileActionsMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = { deleteModalVisible: false }
    this.deleteFile = this.deleteFile.bind(this)
    this.showDeleteModal = this.showDeleteModal.bind(this)
    this.hideDeleteModal = this.hideDeleteModal.bind(this)
  }

  hideDeleteModal() {
    this.setState({ deleteModalVisible: false })
  }

  showDeleteModal() {
    this.setState({ deleteModalVisible: true })
  }

  deleteFile() {
    this.showDeleteModal();
  }

  render() {
    return (
      <React.Fragment>
        <Popover
          title={this.props.triggerElement}
          placement={this.props.placement || 'bottom-start'}
        >
          <Menu>
            <MenuItem onClick={this.deleteFile}>Delete this file...</MenuItem>
          </Menu>
        </Popover>
        <DeleteModal
          visible={this.state.deleteModalVisible}
          onClose={this.hideDeleteModal}
          title={`delete the file  "${this.props.filename}"?`}
          content={this.props.modalBody}
          onCancel={this.hideDeleteModal}
          onDelete={this.props.onDelete}
          elementID={this.props.fileID}
          url={`/api/v1/files/${this.props.fileID}`}
        />
      </React.Fragment>
    )
  }
}
