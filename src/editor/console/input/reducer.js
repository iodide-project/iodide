export default function reducer(state, action) {
  switch (action.type) {
    case "console/input/SET_LANGUAGE": {
      return Object.assign({}, state, { languageLastUsed: action.language });
    }

    case "console/input/UPDATE_TEXT": {
      return Object.assign({}, state, { consoleText: action.consoleText });
    }

    case "console/input/CLEAR_TEXT_CACHE": {
      return Object.assign({}, state, { consoleTextCache: "" });
    }

    case "console/input/RESET_HISTORY_CURSOR": {
      return Object.assign({}, state, { consoleScrollbackPosition: 0 });
    }

    case "console/input/MOVE_HISTORY_CURSOR": {
      // first, let's only scroll through console inputs.
      const inputHistory = state.history.filter(
        d => d.historyType === "CONSOLE_INPUT"
      );
      const historyLength = inputHistory.length;
      // note that we bound consoleScrollbackPosition between
      // zero (which represents the cursor being in th) and historyLength
      const nextScrollback = Math.min(
        Math.max(
          0,
          state.consoleScrollbackPosition + action.consoleCursorDelta
        ),
        historyLength
      );

      let { consoleTextCache } = state;
      if (state.consoleScrollbackPosition === 0) {
        // if we moved FROM 0, set the consoleTextCache from the current value
        consoleTextCache = state.consoleText;
      }

      let nextConsoleText;
      if (nextScrollback === 0) {
        // if we moved TO 0, set the consoleText from the cache
        nextConsoleText = consoleTextCache;
      } else {
        // otherwise set the consoleText to the history value
        nextConsoleText = inputHistory[historyLength - nextScrollback].content;
      }
      return Object.assign({}, state, {
        consoleText: nextConsoleText,
        consoleTextCache,
        consoleScrollbackPosition: nextScrollback
      });
    }

    default: {
      return state;
    }
  }
}
