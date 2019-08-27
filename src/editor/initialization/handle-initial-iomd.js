import { updateIomdContent } from "../actions/editor-actions";

export default function handleInitialIomd(store) {
  const iomdElt = document.getElementById("iomd");
  // FIXME: related to #1416 -- when we rework how we send IOMD to a NB from
  // the server, we should initialize the store with the initial IOMD, which
  // will make this file obselete, and will also allow is to remove the
  // autosave argument from updateIomdContent
  if (iomdElt && iomdElt.innerHTML) {
    store.dispatch(updateIomdContent(iomdElt.innerHTML, false));
  }
}
