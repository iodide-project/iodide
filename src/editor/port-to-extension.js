import { store } from "./store";
import messagePasser from "../shared/utils/redux-to-port-message-passer";

import { iomdParser } from "./iomd-tools/iomd-parser";

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
    // recreating the dispatch at end of updateJSMD
    messagePasser.dispatch({
      type: "UPDATE_IOMD_CONTENT",
      iomd: e.data,
      iomdChunks: iomdParser(e.data)
    });
  }

  port1.onmessage = handleExtensionMessage;
}
export default initWebExtPort;
