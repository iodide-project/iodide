import React from 'react'
import Popover from '../../shared/components/popover'
import Menu from '../../shared/components/menu'
import MenuItem from '../../shared/components/menu-item'
import MenuDivider from '../../shared/components/menu-divider'
import DeleteModal from './delete-modal'

export default class RevisionsActionsMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = { deleteModalVisible: false }
    this.deleteRevision = this.deleteRevision.bind(this)
    this.showDeleteModal = this.showDeleteModal.bind(this)
    this.hideDeleteModal = this.hideDeleteModal.bind(this)
    this.viewRevision = this.viewRevision.bind(this)
  }

  hideDeleteModal() {
    this.setState({ deleteModalVisible: false })
  }

  showDeleteModal() {
    this.setState({ deleteModalVisible: true })
  }

  deleteRevision() {
    this.showDeleteModal();
  }

  viewRevision() {
    window.location = `/notebooks/${this.props.notebookID}?revision=${this.props.revisionID}`
  }

  render() {
    return (
      <React.Fragment>
        <Popover placement="bottom-start" title={this.props.triggerElement || '...'}>
          <Menu>
            <MenuItem onClick={this.viewRevision}>View Revision ...</MenuItem>
            <MenuDivider />
            <MenuItem onClick={this.deleteRevision}>Delete This Revision ...</MenuItem>
          </Menu>
        </Popover>
        <DeleteModal
          visible={this.state.deleteModalVisible}
          onClose={this.hideDeleteModal}
          title={`delete the revision  "${this.props.revisionTitle}"?`}
          content={this.props.modalBody}
          onCancel={this.hideDeleteModal}
          onDelete={this.props.onDelete}
          elementID={this.props.revisionID}
          url={`/api/v1/notebooks/${this.props.notebookID}/revisions/${this.props.revisionID}`}
        />
      </React.Fragment>
    )
  }
}
