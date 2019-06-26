import { store } from "./store";
import messagePasser from "../shared/utils/redux-to-port-message-passer";

import { iomdParser } from "./iomd-tools/iomd-parser";

function unpackExtensionMessage(msg) {
  const msgObj = JSON.parse(msg);
  return msgObj;
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
    const extensionMessage = unpackExtensionMessage(e.data); // this object will have info that can be transformed into the action type to dispatch
    // recreating the dispatch at end of updateJSMD
    messagePasser.dispatch({
      type: "UPDATE_IOMD_CONTENT",
      iomd: extensionMessage.text,
      iomdChunks: iomdParser(extensionMessage.text)
    });
  }

  port1.onmessage = handleExtensionMessage;
}
export default initWebExtPort;
