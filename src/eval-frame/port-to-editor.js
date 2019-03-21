/* global IODIDE_EDITOR_ORIGIN  */

import { evaluateText, evaluateCode } from "./actions/actions";
import { getCompletions } from "./tools/notebook-utils";
import {
  onParentContextFileFetchSuccess,
  onParentContextFileFetchError
} from "./tools/fetch-file-from-parent-context";
import messagePasserEval from "../redux-to-port-message-passer";

const mc = new MessageChannel();
const portToEditor = mc.port1;

let editorReady = false;
const listenForEditorReady = messageEvent => {
  if (messageEvent.data === "EDITOR_READY") {
    // IFRAME CONNECT STEP 4:
    // when evalfram gets "EDITOR_READY", editorReady flag set
    editorReady = true;
    window.removeEventListener("message", listenForEditorReady, false);
  }
};
window.addEventListener("message", listenForEditorReady, false);

function connectToEditor() {
  if (!editorReady) {
    // IFRAME CONNECT STEP 1:
    // "EVAL_FRAME_READY" is sent until the editor recieves
    setTimeout(connectToEditor, 50);
    window.parent.postMessage("EVAL_FRAME_READY", IODIDE_EDITOR_ORIGIN);
  } else {
    // IFRAME CONNECT STEP 5:
    // when editorReady===true, eval frame sends actual port
    window.parent.postMessage("EVAL_FRAME_SENDING_PORT", IODIDE_EDITOR_ORIGIN, [
      mc.port2
    ]);
  }
}
connectToEditor();

export function postMessageToEditor(messageType, message) {
  portToEditor.postMessage({ messageType, message });
}

messagePasserEval.connectPostMessage(postMessageToEditor);

async function receiveMessage(event) {
  const trustedMessage = true;
  if (trustedMessage) {
    const { messageType, message } = event.data;
    switch (messageType) {
      case "STATE_UPDATE_FROM_EDITOR": {
        messagePasserEval.dispatch({
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
          messagePasserEval.dispatch(
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
      case "EVAL_CODE": {
        const { code, language, taskId } = message;
        evaluateCode(code, language, taskId);
        break;
      }
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
