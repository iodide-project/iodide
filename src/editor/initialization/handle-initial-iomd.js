import _ from "lodash";
import { updateIomdContent } from "../actions/editor-actions";

export default function handleInitialIomd(store) {
  const iomdElt = document.getElementById("iomd");
  if (iomdElt && iomdElt.innerHTML) {
    store.dispatch(
      updateIomdContent(_.unescape(iomdElt.innerHTML).replace(/&#x27;/g, "'"))
    );
  }
}
