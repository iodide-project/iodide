import messagePasserEditor from "../../shared/utils/redux-to-port-message-passer";

export function postFileOperationSuccessMessage(
  fileRequestID,
  fileOrResponse,
  messagePasser = messagePasserEditor
) {
  messagePasser.postMessage("REQUESTED_FILE_OPERATION_SUCCESS", {
    response: fileOrResponse,
    fileRequestID
  });
}

export function postFileOperationErrorMessage(
  fileRequestID,
  errorMessage,
  messagePasser = messagePasserEditor
) {
  messagePasser.postMessage("REQUESTED_FILE_OPERATION_ERROR", {
    fileRequestID,
    reason: errorMessage
  });
}
