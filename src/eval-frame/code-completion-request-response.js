export function getObjAtPath(path) {
  let obj = window;
  for (let i = 0; i < path.length; i++) {
    obj = obj[path[i]];
  }
  return obj;
}

export function codeCompletionRequestResponse(message) {
  console.log(message);
  if (message.language === "js") {
    const { path } = message;
    const obj = getObjAtPath(path);
    const items = Object.getOwnPropertyNames(obj);
    console.log({ obj, path, items });
    return items;
  }
  return [];
}
