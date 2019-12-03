export default function reducer(state, action) {
  const { consoleInput } = state;
  switch (action.type) {
    case "console/input/SET_LANGUAGE": {
      return Object.assign({}, state, { languageLastUsed: action.language });
    }

    case "console/input/UPDATE_TEXT": {
      return Object.assign({}, state, {
        consoleInput: { ...consoleInput, consoleText: action.consoleText }
      });
    }

    case "console/input/RESET": {
      return Object.assign({}, state, {
        consoleInput: {
          ...consoleInput,
          consoleScrollbackPosition: 0,
          consoleTextCache: "",
          consoleText: ""
        }
      });
    }

    case "console/input/MOVE_HISTORY_CURSOR": {
      // first, let's only scroll through console inputs.
      const inputHistory = state.history.filter(
        d => d.historyType === "CONSOLE_INPUT"
      );
      const historyLength = inputHistory.length;
      let preConsoleLanguage = "js";
      // note that we bound consoleScrollbackPosition between
      // zero and historyLength. Zero represents the current content entered in the console by the user,
      // not a history entry; the first history entry is at 1
      const nextScrollback = Math.min(
        Math.max(
          0,
          state.consoleInput.consoleScrollbackPosition +
            action.consoleCursorDelta
        ),
        historyLength
      );

      let { consoleTextCache } = state.consoleInput;
      if (state.consoleInput.consoleScrollbackPosition === 0) {
        // if we moved FROM 0, set the consoleTextCache from the current value
        consoleTextCache = state.consoleInput.consoleText;
      }

      let nextConsoleText;
      if (nextScrollback === 0) {
        // if we moved TO 0, set the consoleText from the cache
        nextConsoleText = consoleTextCache;
        preConsoleLanguage =
          historyLength > 0
            ? inputHistory[historyLength - 1].language
            : preConsoleLanguage;
      } else {
        // otherwise set the consoleText to the history value
        nextConsoleText = inputHistory[historyLength - nextScrollback].content;

        preConsoleLanguage =
          inputHistory[historyLength - nextScrollback].language;
      }
      return Object.assign({}, state, {
        consoleInput: {
          consoleText: nextConsoleText,
          consoleTextCache,
          consoleScrollbackPosition: nextScrollback
        },
        languageLastUsed: preConsoleLanguage
      });
    }

    default: {
      return state;
    }
  }
}
