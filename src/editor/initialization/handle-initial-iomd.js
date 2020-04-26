import { updateIomdContent } from "../actions/editor-actions";
import { addTemporaryFile } from "../actions/file-actions";

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

  // add any "files" specified in script tags to the document as temporary files
  document.querySelectorAll('[id^="file-"]').forEach(fileElement => {
    const filename = fileElement.getAttribute("id").split("file-")[1];
    const mimeType = fileElement.getAttribute("mimetype");
    const content = fileElement.innerHTML;
    store.dispatch(addTemporaryFile(filename, content, mimeType));
  });
}
