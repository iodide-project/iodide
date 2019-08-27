// FIXME: this would SUBSTANTIALLY simplified with immer.
function produceIndividualFileSource(fs) {
  return {
    ...fs,
    ...{
      latest_file_update_operation: { ...fs.latest_file_update_operation }
    }
  };
}

function produceSources(sources) {
  return sources ? sources.map(f => produceIndividualFileSource(f)) : [];
}

function produceFileSourcesObject(state) {
  const fileSources = { ...state.fileSources };
  fileSources.sources = produceSources(state.fileSources.sources);
  return fileSources;
}

function produceNewStateWithNestedUpdate(state, kvPair) {
  // this spreads kvPair (an object) into state.fileSources
  const fileSources = { ...produceFileSourcesObject(state), ...kvPair };
  return { ...state, fileSources };
}

function produceNewStateWithUpdatedFileSourcesPrimitive(state, action, key) {
  // to be used only when action[key] is a non-object primitive, eg fileSources.url
  const fileSourcesPair = {};
  fileSourcesPair[key] = action[key];
  return produceNewStateWithNestedUpdate(state, fileSourcesPair);
}

export default (state, action) => {
  // FIXME: remove reduceReducers in reducer.js and have state only reflect
  // the app's fileSources object. This will require refactoring createValidatedReducer
  // but should be considered a high priority.
  switch (action.type) {
    case "UPDATE_FILE_SOURCES": {
      const sources = produceSources(action.fileSources);
      return produceNewStateWithNestedUpdate(state, { sources });
    }

    case "ADD_FILE_SOURCE_TO_NOTEBOOK": {
      const {
        sourceURL,
        destinationFilename,
        updateInterval,
        fileSourceID
      } = action;

      const sources = produceSources(state.fileSources.sources);

      sources.push({
        url: sourceURL,
        filename: destinationFilename,
        update_interval: updateInterval,
        id: fileSourceID,
        latest_file_update_operation: null
      });
      return produceNewStateWithNestedUpdate(state, { sources });
    }

    case "DELETE_FILE_SOURCE_FROM_NOTEBOOK": {
      const { fileSourceID } = action;
      const sources = produceSources(state.fileSources.sources).filter(
        f => f.id !== fileSourceID
      );
      return produceNewStateWithNestedUpdate(state, { sources });
    }

    case "UPDATE_FILE_SOURCE_STATUS": {
      const params = { ...action };
      const { fileSourceID } = action;
      delete params.type;
      delete params.fileSourceID;
      delete params.fileUpdateOperation.file_source_id;
      const sources = state.fileSources.sources.map(f => {
        let newInfo = {};
        const fi = produceIndividualFileSource(f);
        if (fi.id === fileSourceID) {
          newInfo = Object.assign({}, params.fileUpdateOperation);
          fi.latest_file_update_operation = newInfo;
        }
        return fi;
      });
      return produceNewStateWithNestedUpdate(state, { sources });
    }
    case "UPDATE_FILE_SOURCE_INPUT_STATUS_MESSAGE": {
      return produceNewStateWithUpdatedFileSourcesPrimitive(
        state,
        action,
        "statusMessage"
      );
    }

    case "UPDATE_FILE_SOURCE_INPUT_STATUS_TYPE": {
      return produceNewStateWithUpdatedFileSourcesPrimitive(
        state,
        action,
        "statusType"
      );
    }

    case "UPDATE_FILE_SOURCE_INPUT_FILENAME": {
      return produceNewStateWithUpdatedFileSourcesPrimitive(
        state,
        action,
        "filename"
      );
    }

    case "UPDATE_FILE_SOURCE_INPUT_URL": {
      return produceNewStateWithUpdatedFileSourcesPrimitive(
        state,
        action,
        "url"
      );
    }

    case "UPDATE_FILE_SOURCE_INPUT_UPDATE_INTERVAL": {
      return produceNewStateWithUpdatedFileSourcesPrimitive(
        state,
        action,
        "updateInterval"
      );
    }

    case "UPDATE_FILE_SOURCE_INPUT_CONFIRM_DELETE_ID": {
      return produceNewStateWithUpdatedFileSourcesPrimitive(
        state,
        action,
        "confirmDeleteID"
      );
    }

    case "UPDATE_FILE_SOURCE_INPUT_SET_IS_DELETING_ANIMATION_ID": {
      return produceNewStateWithUpdatedFileSourcesPrimitive(
        state,
        action,
        "isDeletingAnimationID"
      );
    }

    case "UPDATE_FILE_SOURCE_STATUS_VISIBILITY": {
      return produceNewStateWithUpdatedFileSourcesPrimitive(
        state,
        action,
        "statusIsVisible"
      );
    }

    default: {
      return state;
    }
  }
};
