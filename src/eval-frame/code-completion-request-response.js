const scopeEndRE = /(\["[^"]*|\['[^']*|\[`[^`]*|\s*\.|\s*\.[_$a-zA-Z][_$a-zA-Z0-9]*)$/;
const scopeRootRE = /[_$a-zA-Z][_$a-zA-Z0-9]*$/;
const scopeMiddleRE = /\s*\.([_$a-zA-Z][_$a-zA-Z0-9]*)$|\["(.*)"\]$|\['(.*)'\]$|\[`(.*)`\]$|\[([0-9]*)\]$/;

export function getCompletionScope(code) {
  let codeRemaining = code;
  const scope = [];
  let match = scopeEndRE.exec(code);
  if (!match) return scope;

  codeRemaining = codeRemaining.slice(0, match.index);
  match = scopeMiddleRE.exec(codeRemaining);

  let scopeItem;
  while (match) {
    // eslint-disable-next-line prefer-destructuring
    scopeItem = match.slice(1).filter(x => x !== undefined)[0];

    scope.unshift(scopeItem);
    codeRemaining = codeRemaining.slice(0, match.index);
    match = scopeMiddleRE.exec(codeRemaining);
  }

  const scopeRoot = scopeRootRE.exec(codeRemaining);
  if (scopeRoot) scope.unshift(scopeRoot[0]);

  return scope;
}

function getObjAtPath(path) {
  let obj = window;
  for (let i = 0; i < path.length; i++) {
    obj = obj[path[i]];
  }
  return obj;
}

function autocompleteJs(code) {
  const path = getCompletionScope(code);
  const obj = getObjAtPath(path);
  const items = Object.getOwnPropertyNames(obj);
  return items;
}

export function codeCompletionRequestResponse(message) {
  const { code, language } = message;
  if (language.languageId === "js") {
    return autocompleteJs(code);
  }
  return window[language.module][language.autocomplete](code);
}
