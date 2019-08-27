import { updateIomdContent } from "../actions/editor-actions";

// Undo Django's template escape behavior; see
// https://docs.djangoproject.com/en/2.2/ref/templates/builtins/#escape
const unescapeMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&#39;": "'",
  "&quot;": '"',
  "&amp;": "&"
};

export default function handleInitialIomd(store) {
  const iomdElt = document.getElementById("iomd");
  // FIXME: related to #1416 -- when we rework how we send IOMD to a NB from
  // the server, we should initialize the store with the initial IOMD, which
  // will make this file obsolete, and will also allow is to remove the
  // autosave argument from updateIomdContent
  if (iomdElt && iomdElt.innerHTML) {
    const content = iomdElt.innerHTML.replace(
      /&(lt|gt|#39|quot|amp);/g,
      match => unescapeMap[match]
    );
    store.dispatch(updateIomdContent(content, false));
  }
}
