const produceFileSource = fs => {
  return Object.assign({}, fs, {
    latest_file_update_operation: Object.assign(
      {},
      fs.latest_file_update_operation
    )
  });
};

const produceFileSources = fileSources => {
  return fileSources.map(fs => {
    return produceFileSource(fs);
  });
};

export default (state, action) => {
  // FIXME: remove reduceReducers in reducer.js and have state only reflect
  // the app's fileSources object. This will require refactoring createValidatedReducer
  // but should be considered a high priority.
  switch (action.type) {
    case "UPDATE_FILE_SOURCES": {
      if (!Array.isArray(action.fileSources))
        throw Error(
          `UPDATE_FILE_SOURCES: expected fileSources to be of type array, instead got ${typeof action.fileSources}`
        );

      const fileSources = produceFileSources(action.fileSources);
      return Object.assign({}, state, { fileSources });
    }

    case "ADD_FILE_SOURCE_TO_NOTEBOOK": {
      const {
        sourceURL,
        destinationFilename,
        updateInterval,
        fileSourceID
      } = action;

      const fileSources = produceFileSources(state.fileSources);

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
      const fileSources = produceFileSources(state.fileSources).filter(
        f => f.id !== fileSourceID
      );
      return Object.assign({}, state, { fileSources });
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
        const fi = produceFileSource(f);
        if (fi.id === fileSourceID) {
          newInfo = Object.assign({}, params.fileUpdateOperation);
          fi.latest_file_update_operation = newInfo;
        }
        return fi;
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
