import CodeMirror from "codemirror";
import { dispatch } from "../store";
// This block is from CodeMirror's loadmode.js, modified to work in this environment

CodeMirror.modeUrl = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/${
  CodeMirror.version
}/mode/%N/%N.js`;
window.CodeMirror = CodeMirror;

const modeLoading = {};
function splitCallback(cont, n) {
  let countDown = n;
  return () => {
    countDown -= 1;
    if (countDown === 0) {
      cont();
    }
  };
}

function ensureDeps(mode, cont) {
  const deps = CodeMirror.modes[mode].dependencies;
  if (!deps) return cont();
  const missing = [];
  for (let i = 0; i < deps.length; ++i) {
    if (!Object.prototype.hasOwnProperty.call(CodeMirror.modes, deps[i])) {
      missing.push(deps[i]);
    }
  }
  if (!missing.length) return cont();
  const split = splitCallback(cont, missing.length);
  for (let i = 0; i < missing.length; ++i) {
    CodeMirror.requireMode(missing[i], split);
  }
  return undefined;
}

CodeMirror.requireMode = (mode, cont) => {
  if (Object.prototype.hasOwnProperty.call(CodeMirror.modes, mode)) {
    return ensureDeps(mode, cont);
  }
  if (Object.prototype.hasOwnProperty.call(modeLoading, mode)) {
    return modeLoading[mode].push(cont);
  }

  const file = CodeMirror.modeUrl.replace(/%N/g, mode);
  const script = document.createElement("script");
  script.src = file;
  const others = document.getElementsByTagName("script")[0];
  modeLoading[mode] = [cont];
  const list = modeLoading[mode];
  CodeMirror.on(script, "load", () => {
    ensureDeps(mode, () => {
      for (let i = 0; i < list.length; ++i) list[i]();
    });
    dispatch({ type: "CODEMIRROR_MODE_READY", codeMirrorMode: mode });
  });
  others.parentNode.insertBefore(script, others);
  return undefined;
};
