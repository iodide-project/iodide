import { evaluateCode } from "./actions/actions";
import { loadLanguagePlugin } from "./actions/language-actions";
import { getUserDefinedVariablesFromWindow } from "./initialize-user-variables";
import { getCompletions } from "./tools/notebook-utils";
import {
  onParentContextFileRequestSuccess,
  onParentContextFileRequestError
} from "./tools/send-file-request-to-editor";
import messagePasserEval from "../shared/utils/redux-to-port-message-passer";
import { sendStatusResponseToEditor } from "./actions/editor-message-senders";
import {
  addCSS,
  loadScriptFromBlob,
  setVariableInWindow
} from "./actions/fetch-cell-eval-actions";

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
    window.parent.postMessage("EVAL_FRAME_READY", window.editorOrigin);
  } else {
    // IFRAME CONNECT STEP 5:
    // when editorReady===true, eval frame sends actual port
    window.parent.postMessage("EVAL_FRAME_SENDING_PORT", window.editorOrigin, [
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
      case "REQUESTED_FILE_OPERATION_SUCCESS": {
        onParentContextFileRequestSuccess(
          message.response,
          message.fileRequestID
        );
        break;
      }
      case "REQUESTED_FILE_OPERATION_ERROR": {
        onParentContextFileRequestError(message.reason, message.fileRequestID);
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
      case "EVAL_CODE": {
        const { code, language, chunkId, taskId } = message;
        evaluateCode(code, language, chunkId, taskId);
        break;
      }
      case "EVAL_LANGUAGE_PLUGIN": {
        const { pluginData, taskId } = message;
        // FIXME: this can be cleaned up, but loadLanguagePlugin
        // is a mess and i'm afraid to touch it
        try {
          await loadLanguagePlugin(pluginData, taskId);
          sendStatusResponseToEditor("SUCCESS", message.taskId);
        } catch {
          sendStatusResponseToEditor("ERROR", message.taskId);
        }
        break;
      }
      case "UPDATE_USER_VARIABLES": {
        sendStatusResponseToEditor("SUCCESS", message.taskId, {
          userDefinedVarNames: getUserDefinedVariablesFromWindow()
        });
        break;
      }
      case "ASSIGN_VARIABLE": {
        const { name, value } = message;
        try {
          setVariableInWindow(name, value);
          sendStatusResponseToEditor("SUCCESS", message.taskId);
        } catch {
          sendStatusResponseToEditor("ERROR", message.taskId);
        }
        break;
      }
      case "LOAD_SCRIPT": {
        const { script } = message;
        try {
          loadScriptFromBlob(script);
          sendStatusResponseToEditor("SUCCESS", message.taskId);
        } catch {
          sendStatusResponseToEditor("ERROR", message.taskId);
        }
        break;
      }
      case "ADD_CSS": {
        const { css, filePath } = message;
        try {
          addCSS(css, filePath);
          sendStatusResponseToEditor("SUCCESS", message.taskId);
        } catch {
          sendStatusResponseToEditor("ERROR", message.taskId);
        }
        break;
      }
      default:
        console.error("unknown messageType", messageType, message);
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
