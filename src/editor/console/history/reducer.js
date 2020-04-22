export default function reducer(state, action) {
  switch (action.type) {
    case "console/history/ADD": {
      const actionCopy = { ...action };
      delete actionCopy.type;
      const history = [...state.history, actionCopy];
      return { ...state, history };
    }

    case "console/history/CLEAR": {
      return { ...state, history: [] };
    }

    case "console/history/UPDATE": {
      const actionCopy = { ...action };
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
      return { ...state, history };
    }

    case "console/history/UPDATE_LINE": {
      const i = state.history.findIndex(h => h.historyId === action.historyId);
      const history = [...state.history.slice()];
      const contentLines = history[i].content;

      contentLines[action.lineIndex] = action.lineContent;

      history[i] = { ...history[i], content: contentLines };
      return { ...state, history };
    }

    case "console/history/SET_SCROLL_TARGET": {
      const history = state.history.map(item => {
        return {
          ...item,
          scrollToThisItem:
            item.historyId === action.historyId ? true : undefined
        };
      });
      return { ...state, history };
    }

    default: {
      return state;
    }
  }
}
