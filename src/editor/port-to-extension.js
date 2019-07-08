import { store } from "./store";
import messagePasser from "../shared/utils/redux-to-port-message-passer";

import { iomdParser } from "./iomd-tools/iomd-parser";

function unpackExtensionMessage(msg) {
  // parse the data json string, msg parameter is actually e.data
  const msgObj = JSON.parse(msg);
  // perform a conversion of message type to action type
  switch (msgObj.exMessageType) {
    case "INSERT_TEXT": {
      console.log("moving cursor");
      const line = msgObj.cursorPosition[0];
      const col = msgObj.cursorPosition[1];
      const retVal = {
        type: "EXTENSION_CURSOR_UPDATE",
        text: msgObj.text,
        line,
        col,
        forceUpdate: true
      };
      return retVal;
    }
    case "REPLACE_ALL": {
      return {
        type: "UPDATE_IOMD_CONTENT",
        iomd: msgObj.text,
        iomdChunks: iomdParser(msgObj.text)
      };
    }
    default:
      return {};
  }
}

function initWebExtPort() {
  messagePasser.connectDispatch(store.dispatch);

  // connect store disptach to the message passer
  //
  const extensionChannel = new MessageChannel();
  const { port1 } = extensionChannel;
  const { port2 } = extensionChannel;

  setTimeout(() => {
    console.log("posting message");
    window.postMessage(
      { direction: "iodide-to-extension", message: "startup" },
      "*",
      [port2]
    );
  }, 3000);

  function handleExtensionMessage(e) {
    console.log("extension says", e);
    console.log("updating");
    // parse the json object that is included in the e.data
    const dispatchObject = unpackExtensionMessage(e.data); // this object will have info that can be transformed into the action type to dispatch
    // recreating the dispatch at end of updateJSMD
    messagePasser.dispatch(dispatchObject);
  }

  port1.onmessage = handleExtensionMessage;
}
export default initWebExtPort;
