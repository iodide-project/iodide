function produceFileSourceInputs(state, action, key) {
  const fileSourceInputs = Object.assign({}, state.fileSourceInputs);
  fileSourceInputs[key] = action[key];
  return Object.assign({}, state, { fileSourceInputs });
}

export default (state, action) => {
  switch (action.type) {
    case "UPDATE_FILE_SOURCE_INPUT_STATUS_MESSAGE": {
      return produceFileSourceInputs(state, action, "statusMessage");
    }

    case "UPDATE_FILE_SOUCE_INPUT_STATUS_TYPE": {
      return produceFileSourceInputs(state, action, "statusType");
    }

    case "UPDATE_FILE_SOURCE_INPUT_FILENAME": {
      return produceFileSourceInputs(state, action, "filename");
    }

    case "UPDATE_FILE_SOURCE_INPUT_URL": {
      return produceFileSourceInputs(state, action, "url");
    }

    case "UPDATE_FILE_SOURCE_INPUT_UPDATE_INTERVAL": {
      return produceFileSourceInputs(state, action, "updateInterval");
    }

    default: {
      return state;
    }
  }
};
