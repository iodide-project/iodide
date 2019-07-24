export default (state, action) => {
  // FIXME: remove reduceReducers in reducer.js and have state only reflect
  // the app's fileSources object. This will require refactoring createValidatedReducer
  // but should be considered a high priority.
  switch (action.type) {
    case "UPDATE_FILE_SOURCES": {
      const fileSources = action.fileSources.map(fs => {
        const fileSource = Object.assign({}, fs);
        fileSource.latest_file_update_operation = Object.assign(
          {},
          fs.latest_file_update_operation
        );
        return fileSource;
      });
      return Object.assign({}, state, { fileSources });
    }

    case "ADD_FILE_SOURCE_TO_NOTEBOOK": {
      const {
        sourceURL,
        destinationFilename,
        updateInterval,
        fileSourceID
      } = action;
      const fileSources = state.fileSources.map(f => {
        return Object.assign({}, f, {
          latest_file_update_operation: Object.assign(
            {},
            f.latest_file_update_operation
          )
        });
      });
      fileSources.push({
        url: sourceURL,
        filename: destinationFilename,
        update_interval: updateInterval,
        id: fileSourceID,
        latest_file_update_operation: null
      });
      return Object.assign({}, state, { fileSources });
    }

    case "DELETE_FILE_SOURCE_FROM_NOTEBOOK": {
      const { fileSourceID } = action;
      const { fileSources } = state;
      return Object.assign({}, state, {
        fileSources: fileSources
          .filter(f => f.id !== fileSourceID)
          .map(f => Object.assign({}, f))
      });
    }

    case "UPDATE_FILE_SOURCE_STATUS": {
      const params = Object.assign({}, action);
      const { fileSourceID } = action;
      delete params.type;
      delete params.fileSourceID;
      delete params.fileUpdateOperation.file_source_id;
      const { fileSources } = state;
      const newFileSources = fileSources.map(f => {
        let newInfo = {};
        if (f.id === fileSourceID) {
          newInfo = Object.assign({}, params.fileUpdateOperation);
        } else {
          newInfo = Object.assign({}, f.latest_file_update_operation);
        }
        return Object.assign({}, f, { latest_file_update_operation: newInfo });
      });
      return Object.assign({}, state, {
        fileSources: newFileSources
      });
    }

    default: {
      return state;
    }
  }
};
