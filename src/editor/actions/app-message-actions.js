import { addAppMessageToConsoleHistory } from "../console/history/actions";

export function updateAppMessages(messageObj) {
  return dispatch => {
    const { message } = messageObj;
    let { messageType, when } = messageObj;
    if (when === undefined) when = new Date().toString();
    if (messageType === undefined) messageType = message;
    // add to eval history.
    dispatch(addAppMessageToConsoleHistory(messageType));
    dispatch({
      type: "UPDATE_APP_MESSAGES",
      message: { message, messageType, when }
    });
  };
}
