function produceFileSourceInputs(state) {
  return Object.assign({}, state.fileSourceInputs);
}

export default (state, action) => {
  switch (action.type) {
    case "UPDATE_FILE_SOURCE_INPUT_FILENAME": {
      const { filename } = action;
      const fileSourceInputs = produceFileSourceInputs(state);
      fileSourceInputs.filename = filename;
      return Object.assign({}, state, { fileSourceInputs });
    }

    case "UPDATE_FILE_SOURCE_INPUT_URL": {
      const { url } = action;
      const fileSourceInputs = produceFileSourceInputs(state);
      fileSourceInputs.url = url;
      return Object.assign({}, state, { fileSourceInputs });
    }

    case "UPDATE_FILE_SOURCE_INPUT_UPDATE_INTERVAL": {
      const { updateInterval } = action;
      const fileSourceInputs = produceFileSourceInputs(state);
      fileSourceInputs.updateInterval = updateInterval;
      return Object.assign({}, state, { fileSourceInputs });
    }

    default: {
      return state;
    }
  }
};
