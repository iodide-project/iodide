export function setVariableInWindow(variableName, variableValue) {
  window[variableName] = variableValue;
}

export function loadScriptFromBlob(blob) {
  // for async script loading from blobs, see:
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const url = URL.createObjectURL(blob);
    script.src = url;
    document.head.appendChild(script);

    script.onload = () => resolve(`scripted loaded`);
    script.onerror = err => reject(new Error(err));
  });
}

export async function addCSS(stylesheet, filePath) {
  document
    .querySelectorAll(`style[data-href='${filePath}']`)
    .forEach(linkNode => {
      linkNode.parentNode.removeChild(linkNode);
    });

  const style = document.createElement("style");
  style.innerHTML = stylesheet;
  style.setAttribute("data-href", filePath);
  document.head.appendChild(style);
  return stylesheet;
}
