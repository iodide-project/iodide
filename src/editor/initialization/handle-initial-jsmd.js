import { updateJsmdContent } from "../actions/actions";

export default function handleInitialJsmd(store) {
  const jsmdElt = document.getElementById("jsmd");
  // FIXME: related to #1416 -- when we rework how we send JSMD to a NB from
  // the server, we should initialize the store with the initial JSMD, which
  // will make this file obselete, and will also allow is to remove the
  // autosave argument from updateJsmdContent
  if (jsmdElt && jsmdElt.innerHTML) {
    store.dispatch(updateJsmdContent(jsmdElt.innerHTML, false));
  }
}
