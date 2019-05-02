import generateRandomId from "../../shared/utils/generate-random-id";
import createHistoryItem from "../../shared/utils/create-history-item";

export function addToConsoleHistory({
  historyType,
  content,
  level,
  language,
  historyId = generateRandomId()
}) {
  const historyAction = createHistoryItem({
    content,
    historyType,
    historyId,
    level,
    language
  });
  historyAction.type = "ADD_TO_CONSOLE_HISTORY";

  return historyAction;
}

export function updateConsoleEntry(args) {
  const updatedHistoryItem = Object.assign({}, args);
  return {
    type: "UPDATE_VALUE_IN_HISTORY",
    historyItem: {
      ...updatedHistoryItem
    }
  };
}
