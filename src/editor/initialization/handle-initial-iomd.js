import { updateIomdContent } from "../actions/editor-actions";

export default function handleInitialIomd(store) {
  const iomdElt = document.getElementById("iomd");

  // this is just enough unescaping to handle the escaping
  // the the Django server does (https://docs.djangoproject.com/en/3.0/ref/utils/#django.utils.html.escape)
  // we can't use lodash's unescape as it assumes a different encoding for the "'" character
  const escapeMapping = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#x27;": "'"
  };

  if (iomdElt && iomdElt.innerHTML) {
    store.dispatch(
      updateIomdContent(
        iomdElt.innerHTML.replace(
          new RegExp(`(${Object.keys(escapeMapping).join("|")})`, "g"),
          str => escapeMapping[str]
        )
      )
    );
  }
}
