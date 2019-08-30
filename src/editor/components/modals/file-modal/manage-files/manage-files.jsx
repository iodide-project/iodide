import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import DeleteModal from "../../../../../shared/components/delete-modal";
import OverwriteModal from "../../../../../shared/components/upload-modal";
import Body from "./body";
import {
  deleteFileOnServer,
  selectMultipleFilesAndFormatMetadata,
  uploadFile
} from "../../../../../shared/utils/file-operations";
import {
  addFileToNotebook,
  deleteFileFromNotebook
} from "../../../../actions/file-request-actions";

export class ManageFilesUnconnected extends React.Component {
  static propTypes = {
    // Required
    deleteFile: PropTypes.func.isRequired,
    notebookID: PropTypes.number.isRequired,
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

  onAddButtonClick = async () => {
    const formDataArray = await selectMultipleFilesAndFormatMetadata(
      this.props.notebookID
    );

    formDataArray.forEach(formData => {
      const unsavedFile = formData.get("file");
      const savedFileKey = this.getSavedFileKey(unsavedFile.name);
      const savedFileID = this.getSavedFileID(savedFileKey);

      if (savedFileKey) {
        this.confirmOverwrite(
          formData,
          unsavedFile.name,
          savedFileKey,
          savedFileID
        );
      } else if (this.fileTooBig(unsavedFile)) {
        this.setState(state => this.fileTooBigUpdater(state, unsavedFile));
      } else if (this.filenameTooLong(unsavedFile)) {
        this.setState(state => this.filenameTooLongUpdater(state, unsavedFile));
      } else {
        this.handleValidFile(formData);
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
   * incrementing by one each additional time this method is called.
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
   * keep track of it before, during, and after upload. Note that these keys are
   * unrelated to the file IDs returned from the server.
   */
  getInitialFiles = () => {
    return this.props.savedFiles.reduce((acc, current) => {
      acc[this.getNewFileKey()] = {
        id: current.id,
        name: current.filename,
        status: "saved"
      };
      return acc;
    }, {});
  };

  getSavedFileKey = name => {
    const fileEntry = Object.entries(this.state.files).find(tuple => {
      if (tuple[1].status === "saved") {
        return tuple[1].name === name;
      }
      return false;
    });
    return fileEntry ? fileEntry[0] : undefined;
  };

  getSavedFileID = fileKey => {
    return this.state.files[fileKey] ? this.state.files[fileKey].id : undefined;
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

  handleValidFile = formData => {
    const fileKey = this.getNewFileKey();
    this.saveFileWithKey(formData, fileKey);
  };

  saveFileWithKey = async (formData, fileKey, fileID = undefined) => {
    const file = formData.get("file");

    // Update state immediately to reflect that this file has begun
    // uploading. This allows us to show a spinner in its row for the
    // duration of the upload.
    this.setState(state =>
      this.fileUploadBeganUpdater(state, fileKey, file.name)
    );

    try {
      const id = await this.props.saveFile(formData, fileID);
      this.setState(state => this.fileSavedUpdater(state, fileKey, id));
    } catch (err) {
      this.setState(state =>
        this.fileErroredUpdater(state, fileKey, "File could not be uploaded")
      );
    }
  };

  fileUploadBeganUpdater = (state, fileKey, name) => {
    const files = this.getFilesStateCopy(state);
    files[fileKey] = {
      name,
      status: "uploading"
    };
    return { files };
  };

  fileSavedUpdater = (state, fileKey, id) => {
    const files = this.getFilesStateCopy(state);
    files[fileKey].status = "saved";
    files[fileKey].id = id;
    return { files };
  };

  fileErroredUpdater = (state, fileKey, errorMessage) => {
    const files = this.getFilesStateCopy(state);
    files[fileKey].status = "error";
    files[fileKey].errorMessage = errorMessage;
    return { files };
  };

  confirmDelete = (name, fileKey, id) => {
    this.setState({ pendingDelete: { name, fileKey, id } });
  };

  hideDeleteModal = () => {
    this.setState({ pendingDelete: false });
  };

  executePendingDelete = async () => {
    try {
      await this.props.deleteFile(this.state.pendingDelete.id);
    } catch (err) {
      this.setState(state =>
        this.fileErroredUpdater(
          state,
          state.pendingDelete.fileKey,
          "File could not be deleted"
        )
      );
    }

    // We don't need to call hideDeleteModal() here because the DeleteModal
    // component will call it for us
  };

  confirmOverwrite = (newFormData, name, existingFileKey, existingFileID) => {
    this.setState(state =>
      this.confirmOverwriteUpdater(
        state,
        newFormData,
        name,
        existingFileKey,
        existingFileID
      )
    );
  };

  confirmOverwriteUpdater = (
    state,
    newFormData,
    name,
    existingFileKey,
    existingFileID
  ) => {
    const pendingOverwritesCopy = Array.from(state.pendingOverwrites);
    pendingOverwritesCopy.push({
      newFormData,
      name,
      existingFileKey,
      existingFileID
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
      pendingOverwrite.newFormData,
      pendingOverwrite.existingFileKey,
      pendingOverwrite.existingFileID
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
      <Body
        files={this.state.files}
        onAddButtonClick={this.onAddButtonClick}
        confirmDelete={this.confirmDelete}
      />
    </React.Fragment>
  );
}

export function mapDispatchToProps(dispatch) {
  return {
    saveFile: async (formData, fileID = undefined) => {
      const response = await uploadFile(formData, fileID);
      const { filename, id } = response;
      const lastUpdated = response.last_updated;
      dispatch(addFileToNotebook(filename, lastUpdated, id));
      return id;
    },
    deleteFile: async fileID => {
      await deleteFileOnServer(fileID);
      dispatch(deleteFileFromNotebook(fileID));
    }
  };
}

export function mapStateToProps(state) {
  return {
    maxFileSize: state.notebookInfo.max_file_size,
    maxFileSizeMB: state.notebookInfo.max_file_size / 1024 / 1024,
    maxFilenameLength: state.notebookInfo.max_filename_length,
    notebookID: state.notebookInfo.notebook_id,
    savedFiles: state.notebookInfo.files
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageFilesUnconnected);
