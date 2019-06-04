import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { ModalContainer } from "../modal-container";
import DeleteModal from "../../../../server/components/delete-modal";
import OverwriteModal from "../../../../server/components/upload-modal";
import TitleBar from "../title-bar";
import Body from "./body";
import { saveFile, deleteFile } from "../../../actions/file-request-actions";

export class FileModalUnconnected extends React.Component {
  static propTypes = {
    // Required
    deleteFile: PropTypes.func.isRequired,
    saveFile: PropTypes.func.isRequired,

    // Not required
    maxFileSize: PropTypes.number,
    maxFileSizeMB: PropTypes.number,
    maxFilenameLength: PropTypes.number,
    savedFiles: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    maxFileSize: false,
    maxFileSizeMB: false,
    maxFilenameLength: false,
    savedFiles: []
  };

  constructor(props) {
    super(props);
    this.state = {
      files: this.getInitialFiles(),
      pendingDelete: false,
      pendingOverwrites: []
    };
  }

  onFileSelection = e => {
    Array.from(e.target.files).forEach(unsavedFile => {
      const existingFileKey = this.getKeyOfSavedOrUploadingFile(unsavedFile);

      if (existingFileKey !== undefined) {
        this.confirmOverwrite(unsavedFile, existingFileKey);
      } else if (this.fileTooBig(unsavedFile)) {
        this.setState(state => this.fileTooBigUpdater(state, unsavedFile));
      } else if (this.filenameTooLong(unsavedFile)) {
        this.setState(state => this.filenameTooLongUpdater(state, unsavedFile));
      } else {
        this.handleValidFile(unsavedFile);
      }
    });
  };

  onDelete = () => {
    this.setState(state => this.deleteUpdater(state));
  };

  getFilesStateCopy = state => {
    return Object.entries(state.files).reduce((acc, [k, v]) => {
      acc[k] = Object.assign({}, v);
      return acc;
    }, {});
  };

  /**
   * Return a unique key for keeping track of a file, starting with 0 and
   * incrementing by one for each additional time this method is called.
   */
  getNewFileKey = () => {
    if (this.lastFileKey === undefined) {
      this.lastFileKey = 0;
    } else {
      this.lastFileKey += 1;
    }
    return this.lastFileKey;
  };

  /**
   * Return an object representing the files that have already been saved to
   * this notebook. Each file is keyed by a unique identifier so that we can
   * keep track of it before, during, and after upload. NB: These keys are in no
   * way related to the IDs set in notebookInfo.
   */
  getInitialFiles = () => {
    return this.props.savedFiles.reduce((acc, current) => {
      acc[this.getNewFileKey()] = {
        name: current.filename,
        status: "saved"
      };
      return acc;
    }, {});
  };

  getKeyOfSavedOrUploadingFile = ({ name }) => {
    const file = Object.entries(this.state.files).find(tuple => {
      if (tuple[1].status === "saved" || tuple[1].status === "uploading") {
        return tuple[1].name === name;
      }
      return false;
    });
    return file ? file[0] : undefined;
  };

  fileTooBig = ({ size }) => {
    return this.props.maxFileSize && size > this.props.maxFileSize;
  };

  filenameTooLong = ({ name: { length } }) => {
    return (
      this.props.maxFilenameLength && length > this.props.maxFilenameLength
    );
  };

  deleteUpdater = state => {
    const files = this.getFilesStateCopy(state);
    files[state.pendingDelete.fileKey].status = "deleted";
    return { files, pendingDelete: false };
  };

  fileTooBigUpdater = (state, { name }) => {
    const files = this.getFilesStateCopy(state);
    files[this.getNewFileKey()] = {
      name,
      status: "error",
      errorMessage: `File exceeds maximum size of ${this.props.maxFileSizeMB}MB`
    };
    return { files };
  };

  filenameTooLongUpdater = (state, { name }) => {
    const files = this.getFilesStateCopy(state);
    files[this.getNewFileKey()] = {
      name,
      status: "error",
      errorMessage: `Filename exceeds maximum length of ${this.props.maxFilenameLength} characters`
    };
    return { files };
  };

  handleValidFile = unsavedFile => {
    const fileKey = this.getNewFileKey();
    this.saveFileWithKey(unsavedFile, fileKey);
  };

  saveFileWithKey = (unsavedFile, fileKey, options = { overwrite: false }) => {
    // Update state immediately to reflect that this file has begun
    // uploading. This allows us to show a spinner in its row for the
    // duration of the upload.
    this.setState(state =>
      this.fileUploadBeganUpdater(state, fileKey, unsavedFile.name)
    );

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(unsavedFile);
    fileReader.onload = async () => {
      try {
        await this.props.saveFile(
          unsavedFile.name,
          fileKey,
          fileReader.result,
          options.overwrite
        );
        this.setState(state => this.fileSavedUpdater(state, fileKey));
      } catch (err) {
        this.setState(state => this.fileErroredUpdater(state, fileKey));
      }
    };
  };

  fileUploadBeganUpdater = (state, fileKey, name) => {
    const files = this.getFilesStateCopy(state);
    files[fileKey] = {
      name,
      status: "uploading"
    };
    return { files };
  };

  fileSavedUpdater = (state, fileKey) => {
    const files = this.getFilesStateCopy(state);
    files[fileKey].status = "saved";
    return { files };
  };

  fileErroredUpdater = (state, fileKey) => {
    const files = this.getFilesStateCopy(state);
    files[fileKey].status = "error";
    files[fileKey].errorMessage = "Upload error";
    return { files };
  };

  confirmDelete = (name, fileKey) => {
    this.setState({ pendingDelete: { name, fileKey } });
  };

  hideDeleteModal = () => {
    this.setState({ pendingDelete: false });
  };

  executePendingDelete = () => {
    try {
      this.props.deleteFile(
        this.state.pendingDelete.name,
        this.state.pendingDelete.fileKey
      );
    } catch (err) {
      this.setState(state =>
        this.fileErroredUpdater(state, state.pendingDelete.fileKey)
      );
    }

    // We don't need to call hideDeleteModal() here because the DeleteModal
    // component will call it for us
  };

  confirmOverwrite = (unsavedFile, existingFileKey) => {
    this.setState(state =>
      this.confirmOverwriteUpdater(state, unsavedFile, existingFileKey)
    );
  };

  confirmOverwriteUpdater = (state, unsavedFile, existingFileKey) => {
    const pendingOverwritesCopy = Array.from(state.pendingOverwrites);
    pendingOverwritesCopy.push({
      newFile: unsavedFile,
      name: unsavedFile.name,
      existingFileKey
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

    this.saveFileWithKey(
      pendingOverwrite.newFile,
      pendingOverwrite.existingFileKey,
      { overwrite: true }
    );

    this.hideOverwriteModal(name);
  };

  render = () => (
    <React.Fragment>
      <DeleteModal
        visible={this.state.pendingDelete !== false}
        title={`Delete file "${this.state.pendingDelete.name}?"`}
        onCloseOrCancel={this.hideDeleteModal}
        onDelete={this.onDelete}
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
      <ModalContainer tabIndex="-1">
        <TitleBar title="Manage Files" />
        <Body
          files={this.state.files}
          onFileSelection={this.onFileSelection}
          confirmDelete={this.confirmDelete}
        />
      </ModalContainer>
    </React.Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    saveFile: (name, id, data, overwrite) => {
      dispatch(saveFile(name, id, data, overwrite, { pendingRequest: false }));
    },
    deleteFile: (name, id) => {
      dispatch(deleteFile(name, id, { pendingRequest: false }));
    }
  };
}

export function mapStateToProps(state) {
  return {
    maxFileSize: state.notebookInfo.max_file_size,
    maxFileSizeMB: state.notebookInfo.max_file_size / 1024 / 1024,
    maxFilenameLength: state.notebookInfo.max_filename_length,
    savedFiles: state.notebookInfo.files
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileModalUnconnected);
