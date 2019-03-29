import generateRandomId from "../../shared/utils/generate-random-id";
import createHistoryItem from "../../shared/utils/create-history-item";

export const EVALUATION_RESULTS = {};

export function addToConsoleHistory({
  historyType,
  content,
  value,
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

  EVALUATION_RESULTS[historyAction.historyId] = value;

  return historyAction;
}

export function updateConsoleEntry(args) {
  const updatedHistoryItem = Object.assign({}, args);
  const { value, historyId } = updatedHistoryItem;
  if (value) {
    EVALUATION_RESULTS[historyId] = value;
    delete updatedHistoryItem.value;
  }
  return {
    type: "UPDATE_VALUE_IN_HISTORY",
    historyItem: {
      ...updatedHistoryItem
    }
  };
}
