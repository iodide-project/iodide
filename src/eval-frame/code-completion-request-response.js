import { getCompletionScope } from "./parse-js-completion-scope";

function getObjAtPath(path) {
  let obj = window;
  for (let i = 0; i < path.length; i++) {
    obj = obj[path[i]];
  }
  return obj;
}

export function autocompleteJs(code) {
  const path = getCompletionScope(code);
  const obj = getObjAtPath(path);
  const items = Object.getOwnPropertyNames(obj);
  console.log({ obj, path, items });
  return items;
}

export function codeCompletionRequestResponse(message) {
  console.log(message);
  const { code, language } = message;
  if (language.languageId === "js") {
    return autocompleteJs(code);
  }
  return window[language.module][language.autocomplete](code);
}
