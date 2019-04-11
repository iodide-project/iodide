import messagePasserEditor from "../../shared/utils/redux-to-port-message-passer";

export function onFileOperationSuccess(
  fileRequestID,
  fileOrResponse,
  messagePasser = messagePasserEditor
) {
  messagePasser.postMessage("REQUESTED_FILE_OPERATION_SUCCESS", {
    response: fileOrResponse,
    fileRequestID
  });
}

export function onFileOperationError(
  fileRequestID,
  err,
  messagePasser = messagePasserEditor
) {
  messagePasser.postMessage("REQUESTED_FILE_OPERATION_ERROR", {
    fileRequestID,
    reason: err.message
  });
}
