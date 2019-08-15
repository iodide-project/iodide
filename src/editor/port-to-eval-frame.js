import Mousetrap from "mousetrap";
import { handleFileRequest } from "./actions/file-request-actions";
import validateActionFromEvalFrame from "./actions/eval-frame-action-validator";
import messagePasserEditor from "../shared/utils/redux-to-port-message-passer";

let portToEvalFrame;

export function postMessageToEvalFrame(messageType, message, messageId) {
  portToEvalFrame.postMessage({ messageType, message, messageId });
}

export function postActionToEvalFrame(actionObj) {
  postMessageToEvalFrame("REDUX_ACTION", actionObj);
}

const approvedKeys = [
  "esc",
  "ctrl+s",
  "ctrl+shift+e",
  "ctrl+d",
  "ctrl+h",
  "ctrl+i",
  "ctrl+shift+left",
  "ctrl+shift+right"
];

function receiveMessage(event) {
  const trustedMessage = true;
  if (trustedMessage) {
    const { messageType, message } = event.data;
    switch (messageType) {
      case "RESPONSE_MESSAGE": {
        const { status, responseId, payload } = message;
        if (typeof responseId !== "string") {
          console.error(
            `messages with messageType===RESPONSE_MESSAGE must have string responseId. This type: ${typeof responseId}`,
            message
          );
        }
        messagePasserEditor.handleMessageResponse(status, responseId, payload);
        break;
      }
      case "EVAL_FRAME_TASK_RESPONSE": {
        messagePasserEditor.dispatch(
          Object.assign(
            { type: `EVAL_FRAME_TASK_RESPONSE-${message.evalId}` },
            message
          )
        );
        break;
      }
      case "FILE_REQUEST": {
        const { requestType, fileName, fileRequestID, options } = message;
        messagePasserEditor.dispatch(
          handleFileRequest(requestType, fileName, fileRequestID, options)
        );
        break;
      }
      case "REDUX_ACTION":
        // in this case, `message` is a redux action
        if (validateActionFromEvalFrame(message)) {
          messagePasserEditor.dispatch(message);
        } else {
          console.error(
            `got unapproved redux action from eval frame: ${message.type}`
          );
        }
        break;
      case "KEYPRESS":
        // in this case, `message` is a keypress string
        if (approvedKeys.includes(message)) {
          Mousetrap.trigger(message);
        } else {
          console.error(
            `got unapproved key press action from eval frame: ${message}`
          );
        }
        break;
      default:
        console.error("unknown messageType", message);
    }
  }
}

export const listenForEvalFramePortReady = messageEvent => {
  if (messageEvent.data === "EVAL_FRAME_READY") {
    // IFRAME CONNECT STEP 2:
    // when editor gets "EVAL_FRAME_READY", it acks "EDITOR_READY"
    document
      .getElementById("eval-frame")
      .contentWindow.postMessage("EDITOR_READY", window.evalFrameOrigin);
  }
  if (messageEvent.data === "EVAL_FRAME_SENDING_PORT") {
    // IFRAME CONNECT STEP 6:
    // editor gets port from eval frame, connection ready
    portToEvalFrame = messageEvent.ports[0]; // eslint-disable-line
    portToEvalFrame.onmessage = receiveMessage;
    messagePasserEditor.connectPostMessage(postMessageToEvalFrame);
    // stop listening for messages once a connection to the eval-frame is made
    window.removeEventListener("message", listenForEvalFramePortReady, false);
  }
};
