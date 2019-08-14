export function updateFileSourceInputFilename(filename) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_FILENAME",
    filename
  };
}

export function updateFileSourceInputURL(url) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_URL",
    url
  };
}

export function updateFileSourceInputUpdateInterval(updateInterval) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_UPDATE_INTERVAL",
    updateInterval
  };
}

export function updateFileSourceInputStatusMessage(statusMessage) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_STATUS_MESSAGE",
    statusMessage
  };
}

export function updateFileSourceInputStatusType(statusType) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_STATUS_TYPE",
    statusType
  };
}
