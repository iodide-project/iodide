import generateRandomId from "./generate-random-id";

export default function createHistoryItem(args) {
  const newArgs = Object.assign({}, args);
  newArgs.historyId = newArgs.historyId || generateRandomId();
  // FIXME remove lastRan everywhere
  newArgs.lastRan = newArgs.lastRan || +new Date();
  return newArgs;
}
