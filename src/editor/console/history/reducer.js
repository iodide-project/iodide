import { types } from "./actions";

export default function reducer(state, action) {
  switch (action.type) {
    case types.ADD: {
      const actionCopy = Object.assign({}, action);
      delete actionCopy.type;
      const history = [...state.history, actionCopy];
      return Object.assign({}, state, { history });
    }
    case types.UPDATE: {
      const actionCopy = Object.assign({}, action);
      const history = [...state.history.slice()];
      const i = history.findIndex(
        h => h.historyId === actionCopy.historyItem.historyId
      );
      const historyEntry = Object.assign(
        {},
        history[i],
        actionCopy.historyItem
      );
      history[i] = historyEntry;
      return Object.assign({}, state, { history });
    }

    case types.UPDATE_LINE: {
      const i = state.history.findIndex(h => h.historyId === action.historyId);
      const history = [...state.history.slice()];
      const contentLines = history[i].content;

      contentLines[action.lineIndex] = action.lineContent;

      history[i] = Object.assign({}, history[i], {
        content: contentLines
      });
      return Object.assign({}, state, { history });
    }

    default: {
      return state;
    }
  }
}
