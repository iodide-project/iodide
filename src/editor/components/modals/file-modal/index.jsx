import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { ModalContainer } from "../modal-container";
import DeleteModal from "../../../../server/components/delete-modal";
import OverwriteModal from "../../../../server/components/upload-modal";
import TitleBar from "../title-bar";
import Body from "./body";
import {
  deleteFileOnServer,
  selectMultipleFilesAndFormatMetadata,
  uploadFile
} from "../../../../shared/utils/file-operations";
import {
  addFileToNotebook,
  deleteFileFromNotebook
} from "../../../actions/file-request-actions";

export class FileModalUnconnected extends React.Component {
  static propTypes = {
    // Required
    addFileToNotebook: PropTypes.func.isRequired,
    deleteFileFromNotebook: PropTypes.func.isRequired,
    notebookID: PropTypes.number.isRequired,

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

  onDelete = () => {
    this.setState(state => this.deleteUpdater(state));
  };

  onAddButtonClick = async () => {
    const formDataArray = await selectMultipleFilesAndFormatMetadata(
      this.props.notebookID
    );

    formDataArray.forEach(formData => {
      const unsavedFile = formData.get("file");
      const savedFileMetadata = this.getSavedFileMetadata(unsavedFile.name);

      if (savedFileMetadata) {
        this.confirmOverwrite(
          formData,
          savedFileMetadata.name,
          savedFileMetadata.fileKey,
          savedFileMetadata.id
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

  getFilesStateCopy = state => {
    return Object.entries(state.files).reduce((acc, [k, v]) => {
      acc[k] = Object.assign({}, v);
      return acc;
    }, {});
  };

  getSavedFileMetadata = name => {
    const file = Object.entries(this.state.files).find(tuple => {
      if (tuple[1].status === "saved") {
        return tuple[1].name === name;
      }
      return false;
    });
    return file ? { name, fileKey: file[0], id: file[1].id } : undefined;
  };

  /**
   * Return an object representing the files that have already been saved to
   * this notebook. Each file is keyed by a unique identifier so that we can
   * keep track of it before, during, and after upload. Note that these keys are
   * in no way related to the file IDs returned from the server.
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

  saveFileWithKey = async (formData, fileKey, existingFileID) => {
    const file = formData.get("file");

    // Update state immediately to reflect that this file has begun
    // uploading. This allows us to show a spinner in its row for the
    // duration of the upload.
    this.setState(state =>
      this.fileUploadBeganUpdater(state, fileKey, file.name)
    );

    try {
      let uploadedFile;

      // Testing existingFileID isn't really necessary (the uploadFile function
      // will behave as expected if it's undefined) but this is more clear.
      if (existingFileID) {
        uploadedFile = await uploadFile(formData, existingFileID);
      } else {
        uploadedFile = await uploadFile(formData);
      }

      this.props.addFileToNotebook(
        uploadedFile.name,
        uploadedFile.last_updated,
        uploadedFile.id
      );

      this.setState(state =>
        this.fileSavedUpdater(state, fileKey, uploadedFile.id)
      );
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
      await deleteFileOnServer(this.state.pendingDelete.id);
      this.props.deleteFileFromNotebook(this.state.pendingDelete.id);
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

  confirmOverwrite = (
    formData,
    existingFileName,
    existingFileKey,
    existingFileID
  ) => {
    this.setState(state =>
      this.confirmOverwriteUpdater(
        state,
        formData,
        existingFileName,
        existingFileKey,
        existingFileID
      )
    );
  };

  confirmOverwriteUpdater = (
    state,
    formData,
    existingFileName,
    existingFileKey,
    existingFileID
  ) => {
    const pendingOverwritesCopy = Array.from(state.pendingOverwrites);
    pendingOverwritesCopy.push({
      newFormData: formData,
      name: existingFileName,
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
      <ModalContainer tabIndex="-1">
        <TitleBar title="Manage Files" />
        <Body
          files={this.state.files}
          onAddButtonClick={this.onAddButtonClick}
          confirmDelete={this.confirmDelete}
        />
      </ModalContainer>
    </React.Fragment>
  );
}

export function mapDispatchToProps(dispatch) {
  return {
    addFileToNotebook: (name, lastUpdated, id) => {
      dispatch(addFileToNotebook(name, lastUpdated, id));
    },
    deleteFileFromNotebook: id => {
      dispatch(deleteFileFromNotebook(id));
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
)(FileModalUnconnected);
