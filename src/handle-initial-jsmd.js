import { updateJsmdContent } from "./actions/actions";

export default function handleInitialJsmd(store) {
  const jsmdElt = document.getElementById("jsmd");
  if (jsmdElt && jsmdElt.innerHTML) {
    store.dispatch(updateJsmdContent(jsmdElt.innerHTML, false));
  }
}
