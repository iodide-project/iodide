import React from "react";
import PropTypes from "prop-types";
import Popover from "../../shared/components/popover";
import Menu from "../../shared/components/menu";
import MenuItem from "../../shared/components/menu-item";
import MenuDivider from "../../shared/components/menu-divider";
import DeleteModal from "../../shared/components/delete-modal";
import UploadModal from "../../shared/components/upload-modal";
import {
  selectSingleFileAndFormatMetadata,
  uploadFile
} from "../../shared/utils/file-operations";
import { deleteNotebookRequest } from "../../shared/server-api/notebook";

export default class NotebookActionsMenu extends React.Component {
  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.object),
    onUploadFile: PropTypes.func,
    notebookID: PropTypes.number,
    hideRevisions: PropTypes.bool,
    triggerElement: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    placement: PropTypes.string,
    onDelete: PropTypes.func,
    modalBody: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.array
    ]),
    isUserAccount: PropTypes.bool,
    notebookTitle: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      deleteModalVisible: false,
      uploadFileConfirmationVisible: false,
      newFile: undefined,
      oldFile: undefined
    };
    // notebook delete functions
    this.deleteNotebook = this.deleteNotebook.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    // file handling functions
    this.selectFile = this.selectFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.hideUploadFileConfirmationModal = this.hideUploadFileConfirmationModal.bind(
      this
    );
    // nav functions
    this.goToRevisionsPage = this.goToRevisionsPage.bind(this);
  }

  // FIXME: Rewrite with async/await
  // https://github.com/iodide-project/iodide/pull/1676/files#r282216780
  selectFile(notebookID) {
    selectSingleFileAndFormatMetadata(notebookID).then(formData => {
      let filename;
      try {
        const metadata = JSON.parse(formData.get("metadata"));
        filename = metadata.filename; // eslint-disable-line prefer-destructuring
      } catch (err) {
        throw err;
      }
      const fileDoesntExistYet = !this.props.files
        .map(f => f.filename)
        .includes(filename);
      if (fileDoesntExistYet) {
        this.setState({ newFile: undefined });
        this.uploadFile(formData);
      } else {
        // if filename is in this.props.files ask before uploading and replacing.
        const oldFile = this.props.files.filter(
          f => f.filename === filename
        )[0];
        this.setState({
          newFile: formData,
          uploadFileConfirmationVisible: true,
          oldFile
        });
      }
    });
  }

  async uploadFile(formData) {
    const data = await uploadFile(formData);
    // FIXME: uploadFile needs better error handling.
    if (this.props.onUploadFile) this.props.onUploadFile(data);
  }

  async updateFile() {
    const response = await uploadFile(
      this.state.newFile,
      this.state.oldFile.id
    );
    const data = await response.json();
    if (this.props.onUploadFile) this.props.onUploadFile(data);
    this.hideUploadFileConfirmationModal();
  }

  hideDeleteModal() {
    this.setState({ deleteModalVisible: false });
  }

  showDeleteModal() {
    this.setState({ deleteModalVisible: true });
  }

  hideUploadFileConfirmationModal() {
    this.setState({ uploadFileConfirmationVisible: false });
  }

  deleteNotebook() {
    this.showDeleteModal();
  }

  goToRevisionsPage() {
    window.location = `/notebooks/${this.props.notebookID}/revisions/`;
  }

  render() {
    if (this.props.hideRevisions && !this.props.isUserAccount) return null;
    return (
      <React.Fragment>
        <Popover
          title={this.props.triggerElement}
          placement={this.props.placement || "bottom-start"}
        >
          <Menu>
            {this.props.hideRevisions ? (
              undefined
            ) : (
              <MenuItem onClick={this.goToRevisionsPage}>
                View Revisions...
              </MenuItem>
            )}
            {this.props.isUserAccount && this.props.onUploadFile ? (
              <MenuItem onClick={() => this.selectFile(this.props.notebookID)}>
                Upload a File ...
              </MenuItem>
            ) : (
              undefined
            )}
            {this.props.hideRevisions || !this.props.isUserAccount ? (
              undefined
            ) : (
              <MenuDivider />
            )}
            {!this.props.isUserAccount ? (
              undefined
            ) : (
              <MenuItem onClick={this.deleteNotebook}>
                Delete This Notebook...
              </MenuItem>
            )}
          </Menu>
        </Popover>
        <DeleteModal
          visible={this.state.deleteModalVisible}
          onCloseOrCancel={this.hideDeleteModal}
          title={`delete the notebook  "${this.props.notebookTitle}"?`}
          content={this.props.modalBody}
          onDelete={this.props.onDelete}
          elementID={this.props.notebookID}
          deleteFunction={deleteNotebookRequest}
        />
        <UploadModal
          visible={this.state.uploadFileConfirmationVisible}
          onCloseOrCancel={this.hideUploadFileConfirmationModal}
          onUpdateFile={this.updateFile}
          oldFile={this.state.oldFile}
        />
      </React.Fragment>
    );
  }
}
