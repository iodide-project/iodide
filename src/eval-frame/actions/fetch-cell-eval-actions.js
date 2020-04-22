export function setVariableInWindow(variableName, variableValue) {
  window[variableName] = variableValue;
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
