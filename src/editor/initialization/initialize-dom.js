/* global IODIDE_EVAL_FRAME_ORIGIN IODIDE_VERSION */

/* the code in this file initialize a few DOM elements for the react
elements to mount. There are a few legacy versions of the DOM template
we want to support

v1: has a `#page` element that the whole app mounts,
and no iframe#eval-frame yet

v2: has an iframe inside of `#panes-container`

v3: iframe#eval-frame is directly in <body>, and no other divs for react to mount

as of v3: need to set up the DOM to have
<body>
  <div#notebook-header>
  <div#editor-react-root>
  <iframe#eval-frame>
</body>
*/

const pageElt = document.getElementById("page");
const panesContainerElt = document.getElementById("panes-container");
let iframeElt = document.getElementById("eval-frame");
// the following is provided for backward compatibility with old html
// bundles that have a 'page' element and no 'eval-frame'
if (iframeElt === null && pageElt !== null) {
  // insert an iframe
  iframeElt = document.createElement("iframe");
  iframeElt.id = "eval-frame";
  iframeElt.src = `${IODIDE_EVAL_FRAME_ORIGIN}/iodide.eval-frame.${IODIDE_VERSION}.html`;
  iframeElt.setAttribute("sandbox", "allow-scripts allow-same-origin");
  iframeElt.setAttribute("allowfullscreen", "true");
  iframeElt.setAttribute("allowvr", "yes");
  document.body.appendChild(iframeElt);
}
if (iframeElt !== null && panesContainerElt !== null) {
  // in case of html template v2, nothing is required,
  // but note that this will leave a legacy div#panes-container
  // wrapping iframe#eval-frame
}
if (iframeElt !== null && panesContainerElt === null) {
  // in case of html template v3, nothing is required
}

// insert the divs for the header and editor
const editorElt = document.createElement("div");
editorElt.id = "editor-react-root";
document.body.prepend(editorElt);

const headerElt = document.createElement("div");
headerElt.id = "notebook-header";
document.body.prepend(headerElt);
