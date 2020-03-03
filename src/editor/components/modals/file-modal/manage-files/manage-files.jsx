import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import DeleteModal from "../../../../../shared/components/delete-modal";
import OverwriteModal from "../../../../../shared/components/upload-modal";
import { selectMultipleFilesAndFormatMetadata } from "../../../../../shared/utils/file-operations";
import {
  addTemporaryFile,
  deleteFile,
  fileOperationError,
  saveFile
} from "../../../../actions/file-actions";

import Body from "./body";
import { fileShape } from "./propShapes";

export class ManageFilesUnconnected extends React.Component {
  static propTypes = {
    // Required
    canUploadFiles: PropTypes.bool.isRequired,
    deleteFile: PropTypes.func.isRequired,
    fileOperationError: PropTypes.func.isRequired,
    notebookID: PropTypes.number.isRequired,
    saveFile: PropTypes.func.isRequired,
    saveTemporaryFile: PropTypes.func.isRequired,
    savedFiles: PropTypes.arrayOf(PropTypes.shape(fileShape)).isRequired,

    // Not required
    maxFileSize: PropTypes.number,
    maxFileSizeMB: PropTypes.number,
    maxFilenameLength: PropTypes.number
  };

  static defaultProps = {
    maxFileSize: false,
    maxFileSizeMB: false,
    maxFilenameLength: false
  };

  constructor(props) {
    super(props);
    this.state = {
      pendingDelete: false,
      pendingOverwrites: []
    };
  }

  onAddButtonClick = async () => {
    const formDataArray = await selectMultipleFilesAndFormatMetadata(
      this.props.notebookID
    );

    formDataArray.forEach(async formData => {
      this.saveFile(formData);
    });
  };

  saveFile = async (formData, confirmedOverwrite = false) => {
    const unsavedFile = formData.get("file");

    if (
      !confirmedOverwrite &&
      this.props.savedFiles.find(f => f.filename === unsavedFile.name)
    ) {
      this.confirmOverwrite(formData, unsavedFile.name);
    } else if (this.fileTooBig(unsavedFile)) {
      this.props.fileOperationError(
        unsavedFile.name,
        `File exceeds maximum size of ${this.props.maxFileSizeMB}MB`
      );
    } else if (this.filenameTooLong(unsavedFile)) {
      this.props.fileOperationError(
        unsavedFile.name,
        `Filename exceeds maximum length of ${this.props.maxFilenameLength} characters`
      );
    } else if (!this.props.canUploadFiles) {
      // if we can't upload files store a temporary file
      // we store the file content as base64 to get around the fact that we can't
      // store array buffers in our state schema
      const fileContent = await unsavedFile.arrayBuffer();
      this.props.saveTemporaryFile(
        unsavedFile.name,
        btoa(String.fromCharCode(...new Uint8Array(fileContent))),
        unsavedFile.type
      );
    } else {
      this.props.saveFile(formData);
    }
  };

  fileTooBig = ({ size }) => {
    return this.props.maxFileSize && size > this.props.maxFileSize;
  };

  filenameTooLong = ({ name: { length } }) => {
    return (
      this.props.maxFilenameLength && length > this.props.maxFilenameLength
    );
  };

  confirmDelete = file => {
    this.setState({ pendingDelete: file });
  };

  hideDeleteModal = () => {
    this.setState({ pendingDelete: undefined });
  };

  executePendingDelete = async () => {
    this.props.deleteFile(this.state.pendingDelete.filename);

    // We don't need to call hideDeleteModal() here because the DeleteModal
    // component will call it for us
  };

  confirmOverwrite = (newFormData, name) => {
    this.setState(state =>
      this.confirmOverwriteUpdater(state, newFormData, name)
    );
  };

  confirmOverwriteUpdater = (state, newFormData, name) => {
    const pendingOverwritesCopy = Array.from(state.pendingOverwrites);
    pendingOverwritesCopy.push({
      newFormData,
      name
    });
    return { pendingOverwrites: pendingOverwritesCopy };
  };

  hideOverwriteModal = name => {
    this.setState(state => this.hideOverwriteModalUpdater(state, name));
  };

  hideOverwriteModalUpdater = (state, name) => {
    return {
      pendingOverwrites: state.pendingOverwrites.filter(po => po.name !== name)
    };
  };

  executePendingOverwrite = name => {
    const pendingOverwrite = this.state.pendingOverwrites.find(po => {
      return po.name === name;
    });

    this.saveFile(pendingOverwrite.newFormData, true);

    this.hideOverwriteModal(name);
  };

  render = () => (
    <React.Fragment>
      <DeleteModal
        visible={!!this.state.pendingDelete}
        title={
          this.state.pendingDelete
            ? `Delete file "${this.state.pendingDelete.filename}?"`
            : ""
        }
        onCloseOrCancel={this.hideDeleteModal}
        deleteFunction={this.executePendingDelete}
        aboveOtherModals
      />
      {this.state.pendingOverwrites[0] && (
        <OverwriteModal
          onCloseOrCancel={() => {
            this.hideOverwriteModal(this.state.pendingOverwrites[0].name);
          }}
          onUpdateFile={() => {
            this.executePendingOverwrite(this.state.pendingOverwrites[0].name);
          }}
          oldFile={{ filename: this.state.pendingOverwrites[0].name }}
          aboveOtherModals
        />
      )}
      <Body
        files={this.props.savedFiles}
        onAddButtonClick={this.onAddButtonClick}
        confirmDelete={this.confirmDelete}
      />
    </React.Fragment>
  );
}

export function mapDispatchToProps(dispatch) {
  return {
    saveTemporaryFile: (filename, content, type) => {
      dispatch(addTemporaryFile(filename, content, type));
    },
    saveFile: async formData => {
      dispatch(saveFile(formData));
    },
    deleteFile: filename => {
      dispatch(deleteFile(filename));
    },
    fileOperationError: (filename, errorMessage) => {
      dispatch(fileOperationError(filename, errorMessage));
    }
  };
}

export function mapStateToProps(state) {
  return {
    maxFileSize: state.notebookInfo.max_file_size,
    maxFileSizeMB: state.notebookInfo.max_file_size / 1024 / 1024,
    maxFilenameLength: state.notebookInfo.max_filename_length,
    notebookID: state.notebookInfo.notebook_id,
    savedFiles: state.notebookInfo.files,
    canUploadFiles: state.notebookInfo.user_can_save
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageFilesUnconnected);
