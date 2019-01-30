/* global IODIDE_EDITOR_ORIGIN  */

import { evaluateText } from "./actions/actions";
import { getCompletions } from "./tools/notebook-utils";
import {
  onParentContextFileFetchSuccess,
  onParentContextFileFetchError
} from "./tools/fetch-file-from-parent-context";
import messagePasser from "../redux-to-port-message-passer";

const mc = new MessageChannel();
const portToEditor = mc.port1;

let editorReady = false;
const listenForEditorReady = messageEvent => {
  if (messageEvent.data === "EDITOR_READY") {
    editorReady = true;
    window.removeEventListener("message", listenForEditorReady, false);
  }
};
window.addEventListener("message", listenForEditorReady, false);

function connectToEditor() {
  if (!editorReady) {
    setTimeout(connectToEditor, 50);
    window.parent.postMessage("EVAL_FRAME_READY", IODIDE_EDITOR_ORIGIN);
  } else {
    window.parent.postMessage("EVAL_FRAME_SENDING_PORT", IODIDE_EDITOR_ORIGIN, [
      mc.port2
    ]);
  }
}
connectToEditor();

export function postMessageToEditor(messageType, message) {
  portToEditor.postMessage({ messageType, message });
}

messagePasser.connectPostMessage(postMessageToEditor);

function receiveMessage(event) {
  const trustedMessage = true;
  if (trustedMessage) {
    const { messageType, message } = event.data;
    switch (messageType) {
      case "STATE_UPDATE_FROM_EDITOR": {
        messagePasser.dispatch({
          type: "REPLACE_STATE",
          state: message
        });
        break;
      }
      case "REQUESTED_FILE_SUCCESS": {
        onParentContextFileFetchSuccess(message.file, message.path);
        break;
      }
      case "REQUESTED_FILE_ERROR": {
        onParentContextFileFetchError(message.reason, message.path);
        break;
      }
      case "REQUEST_AUTOCOMPLETE_SUGGESTIONS": {
        const { token, context, from, to } = message;
        postMessageToEditor("AUTOCOMPLETION_SUGGESTIONS", {
          list: getCompletions(token, context),
          from,
          to
        });
        break;
      }
      case "REDUX_ACTION":
        if (message.type === "TRIGGER_TEXT_EVAL_IN_FRAME") {
          messagePasser.dispatch(
            evaluateText(
              message.evalText,
              message.evalType,
              message.evalFlags,
              message.chunkId,
              message.evalId
            )
          );
        }
        break;
      default:
        console.error("unknown messageType", message);
    }
  }
}

portToEditor.onmessage = receiveMessage;

export function postActionToEditor(actionObj) {
  postMessageToEditor("REDUX_ACTION", actionObj);
}

export function postKeypressToEditor(keypressStr) {
  postMessageToEditor("KEYPRESS", keypressStr);
}
