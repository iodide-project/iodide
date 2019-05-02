import generateRandomId from "./generate-random-id";

export default function createHistoryItem(args) {
  const newArgs = Object.assign({}, args);
  newArgs.historyId = newArgs.historyId || generateRandomId();
  return newArgs;
}
